import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  CreateConnectorRequest,
  CreateProvidedConnectorRequest,
} from '@sovity.de/authority-portal-client';
import * as forge from 'node-forge';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {CertificateGenerateService} from 'src/app/shared/services/certificate-generate.service';
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
  keyPair!: forge.pki.rsa.KeyPair;
  publicKeyPem!: string;
  privateKeyPem!: string;
  isDownloadActive: boolean = false;
  hasDownloadedKey: boolean = false;
  environmentId!: string;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    private formBuilder: FormBuilder,
    private certificateGenerateService: CertificateGenerateService,
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
      certificate: [initial.certificate, [Validators.required]],
      environmentId: [initial.environmentId],
    });
  }

  generateCertificate() {
    this.keyPair = this.certificateGenerateService.generateKeyPair(2048);
    this.publicKeyPem = this.certificateGenerateService.publicKeyToPem(
      this.keyPair.publicKey,
    );
    this.privateKeyPem = this.certificateGenerateService.privateKeyToPem(
      this.keyPair.privateKey,
    );
    this.group.controls['certificate'].setValue(this.publicKeyPem);
    this.isDownloadActive = true;
  }

  downloadPrivateKey() {
    this.hasDownloadedKey = true;
    const blob = new Blob([this.privateKeyPem], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'private_key.pem';

    // Trigger the download
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
