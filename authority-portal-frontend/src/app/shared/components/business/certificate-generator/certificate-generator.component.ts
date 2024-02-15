import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {
  CertificateAttributes,
  CertificateGenerateService,
  CertificateResult,
} from 'src/app/shared/services/certificate-generate.service';
import {passwordEntropyValidator} from '../../../../core/utils/validators/password-entropy-validator';
import {passwordMatchValidator} from '../../../../core/utils/validators/password-match-validator';
import {PreDefinedCertificateDetails} from './certificate-generator.model';

@Component({
  selector: 'app-certificate-generator',
  templateUrl: './certificate-generator.component.html',
})
export class CertificateGeneratorComponent implements OnInit, OnDestroy {
  @Input() preDefinedDetails!: PreDefinedCertificateDetails;
  @Output() certificateGenerated = new EventEmitter<string>();

  certificateDetailsForm = this.formBuilder.nonNullable.group(
    {
      organizationalName: [
        {value: this.preDefinedDetails.organizationalName, disabled: true},
        [Validators.required],
      ],
      organizationalUnit: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: [
        {value: this.preDefinedDetails.country, disabled: true},
        [Validators.required],
      ],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      commonName: [
        {value: this.preDefinedDetails.commonName, disabled: true},
        [Validators.required],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          passwordEntropyValidator,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {validators: passwordMatchValidator('password', 'confirmPassword')},
  );

  showPassword: boolean = false;
  isGenerating: boolean = false;
  isDisabled: boolean = false;
  hasDownloadedKey: boolean = false;

  private ngOnDestroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private certificateGenerateService: CertificateGenerateService,
  ) {}

  ngOnInit() {
    this.formListener();
  }
  formListener() {
    this.certificateDetailsForm.valueChanges
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(() => {
        this.certificateGenerated.emit('');
        this.isDisabled = false;
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  requestForCertificate() {
    this.isGenerating = true;
    const certificateAttributes: CertificateAttributes = {
      commonName: this.certificateDetailsForm.controls.commonName.value,
      countryName: this.certificateDetailsForm.controls.country.value,
      stateName: this.certificateDetailsForm.controls.state.value,
      localityName: this.certificateDetailsForm.controls.city.value,
      organizationName:
        this.certificateDetailsForm.controls.organizationalName.value,
      organizationalUnitName:
        this.certificateDetailsForm.controls.organizationalUnit.value,
      emailAddress: this.certificateDetailsForm.controls.email.value,
    };

    const result = this.generateCertificate(certificateAttributes);
    this.downloadCertificate(result.fileUrl);
    this.isGenerating = false;
    this.isDisabled = true;
    this.certificateGenerated.emit(result.pemCertificate);
  }

  /**
   * takes the certificate attributes and generates the certificate
   * @param certificateAttributes
   * @returns
   */
  generateCertificate(
    certificateAttributes: CertificateAttributes,
  ): CertificateResult {
    this.isGenerating = true;
    const keyPair = this.certificateGenerateService.generateKeyPair(2048);
    const validUntil = new Date(
      new Date().setFullYear(new Date().getFullYear() + 5),
    ); // gets a day five year from now
    const selfSignedCertificate =
      this.certificateGenerateService.generateSelfSignedCertificate(
        keyPair,
        certificateAttributes,
        validUntil,
      );
    const pemCertificate = this.certificateGenerateService.certificateToPem(
      selfSignedCertificate,
    );
    const p12FormatCertificate =
      this.certificateGenerateService.convertToP12Format(
        keyPair.privateKey,
        selfSignedCertificate,
        this.certificateDetailsForm.controls.password.value,
      );

    const certificateBlob =
      this.certificateGenerateService.getCertificateBlob(p12FormatCertificate);

    const fileUrl = certificateBlob
      ? window.URL.createObjectURL(certificateBlob)
      : null;
    this.isGenerating = false;
    return {
      pemCertificate,
      p12FormatCertificate,
      certificateBlob,
      fileUrl,
    };
  }

  downloadCertificate(url: string | null) {
    if (!url) {
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-certificate.p12';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
