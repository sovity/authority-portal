import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  CertificateAttributes,
  CertificateGenerateService,
} from '../../services/certificate-generate.service';
import {
  CertificateGeneratorConfig,
  CertificateResult,
} from './certificate-generator.model';

@Component({
  selector: 'app-certificate-generator',
  templateUrl: './certificate-generator.component.html',
})
export class CertificateGeneratorComponent implements OnInit {
  certificateForm!: FormGroup;
  showPassword = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CertificateGeneratorConfig,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private certificateGenerateService: CertificateGenerateService,
    private dialogRef: MatDialogRef<CertificateGeneratorComponent>,
  ) {}

  ngOnInit(): void {
    this.createCertificateForm();
  }

  createCertificateForm() {
    this.certificateForm = this.formBuilder.group(
      {
        commonName: [{value: this.data.commonName, disabled: true}],
        legalName: [
          {value: this.data.legalName, disabled: this.data.legalName !== ''},
          [Validators.required],
        ],
        organizationalUnit: ['', [Validators.required]],
        country: [
          {value: this.data.country, disabled: true},
          [Validators.required],
        ],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
        email: [this.data.email ?? '', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {validator: this.passwordMatchValidator},
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.controls['password']?.value;
    const confirmPassword = formGroup.controls['confirmPassword']?.value;
    return password === confirmPassword ? null : {mismatch: true};
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * prepares the certificate attributes and call generates certificate
   */
  requestForCertificate() {
    const certificateAttributes: CertificateAttributes = {
      commonName: this.data.commonName,
      countryName: this.data.country,
      stateName: this.certificateForm.controls['state'].value,
      localityName: this.certificateForm.controls['city'].value,
      organizationName: this.certificateForm.controls['legalName'].value,
      organizationalUnitName:
        this.certificateForm.controls['organizationalUnit'].value,
      emailAddress: this.certificateForm.controls['email'].value,
    };

    const result = this.generateCertificate(certificateAttributes);
    this.dialogRef.close(result);
  }

  /**
   * takes the certificate attributes and generates the certificate
   * @param certificateAttributes
   * @returns
   */
  generateCertificate(
    certificateAttributes: CertificateAttributes,
  ): CertificateResult {
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
        this.certificateForm.controls['password'].value,
      );

    const certificateBlob =
      this.certificateGenerateService.getCertificateBlob(p12FormatCertificate);
    return {
      pemCertificate,
      p12FormatCertificate,
      certificateBlob,
    };
  }
}
