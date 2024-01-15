import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {CreateProvidedConnectorRequest} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {CertificateGeneratorComponent} from 'src/app/shared/components/certificate-generator/certificate-generator.component';
import {
  CertificateGeneratorConfig,
  CertificateResult,
} from 'src/app/shared/components/certificate-generator/certificate-generator.model';
import {Reset, Submit} from '../state/provide-connector-page-actions';
import {
  DEFAULT_PROVIDE_CONNECTOR_STATE,
  ProvideConnectorPageState,
} from '../state/provide-connector-page-state';
import {ProvideConnectorPageStateImpl} from '../state/provide-connector-page-state-impl';
import {
  DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE,
  ProvideConnectorPageFormModel,
  ProvideConnectorPageFormValue,
} from './provide-connector-page-form-model';

@Component({
  selector: 'app-provide-connector-page',
  templateUrl: './provide-connector-page.component.html',
  styles: [],
})
export class ProvideConnectorPageComponent implements OnInit, OnDestroy {
  state = DEFAULT_PROVIDE_CONNECTOR_STATE;
  group = this.buildFormGroup();
  p12Certificate!: string;
  isDownloadActive: boolean = false;
  fileUrl!: string | null;
  environmentId!: string;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(Reset);
    this.startListeningToState();
  }

  private startListeningToState() {
    this.store
      .select<ProvideConnectorPageState>(ProvideConnectorPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  buildFormGroup(): FormGroup<ProvideConnectorPageFormModel> {
    const initial = DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE;

    return this.formBuilder.nonNullable.group({
      name: [initial.name, [Validators.required]],
      location: [initial.location, [Validators.required]],
      url: [initial.url, [Validators.required]],
      mdsId: [initial.mdsId, [Validators.required]],
      certificate: [
        initial.certificate,
        [
          Validators.required,
          Validators.pattern(
            /^(-----BEGIN CERTIFICATE-----)[\s\S]*?(-----END CERTIFICATE-----)\s*$/m,
          ),
        ],
      ],
      environmentId: [initial.environmentId],
    });
  }

  get value(): ProvideConnectorPageFormValue {
    return this.group.value as ProvideConnectorPageFormValue;
  }

  openCertificateDialog() {
    const config: CertificateGeneratorConfig = {
      country: this.group.controls['location'].value,
      legalName: '',
      commonName: this.group.controls['url'].value,
      email: '',
    };
    const dialogRef = this.dialog.open(CertificateGeneratorComponent, {
      data: config,
      width: '50%',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((result: CertificateResult) => {
        if (result) {
          this.group.controls['certificate'].setValue(result.pemCertificate);
          this.p12Certificate = result.p12FormatCertificate;
          this.fileUrl = result.certificateBlob
            ? window.URL.createObjectURL(result.certificateBlob)
            : null;

          if (this.fileUrl) {
            this.isDownloadActive = true;
            this.downloadCertificate(this.fileUrl);
          }
        }
      });
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

  submit(): void {
    let formValue: ProvideConnectorPageFormValue = this.group
      .value as ProvideConnectorPageFormValue;
    let request: CreateProvidedConnectorRequest = {
      mdsId: formValue.mdsId,
      environmentId: formValue.environmentId,
      createConnectorRequest: {
        name: formValue.name,
        location: formValue.location,
        url: formValue.url,
        certificate: formValue.certificate,
      },
    };

    this.store.dispatch(
      new Submit(
        request,
        () => this.group.enable(),
        () => this.group.disable(),
      ),
    );
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.store.dispatch(Reset);
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
