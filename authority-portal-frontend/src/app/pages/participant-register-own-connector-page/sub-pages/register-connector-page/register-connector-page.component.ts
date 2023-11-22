import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import * as forge from 'node-forge';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {downloadFile} from 'src/app/core/utils/helper';
import {CertificateGenerateService} from 'src/app/shared/services/certificate-generate.service';
import {
  Reset,
  Submit,
} from '../../state/participant-register-own-connector-page-actions';
import {
  DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE,
  ParticipantRegisterOwnConnectorPageState,
} from '../../state/participant-register-own-connector-page-state';
import {ParticipantRegisterOwnConnectorPageStateImpl} from '../../state/participant-register-own-connector-page-state-impl';
import {RegisterConnectorForm} from './register-connector-form';

@Component({
  selector: 'app-register-connector-page',
  templateUrl: './register-connector-page.component.html',
  providers: [RegisterConnectorForm],
})
export class RegisterConnectorPageComponent implements OnInit, OnDestroy {
  state = DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE;

  keyPair!: forge.pki.rsa.KeyPair;
  publicKeyPem!: string;
  privateKeyPem!: string;
  hasCertificate: boolean = false;
  isDownloadActive: boolean = false;
  isGenerating: boolean = false;
  hasDownloadedKey: boolean = false;
  isLinear: boolean = true;

  connectorDetailsFormGroup = this.form.formGroup.controls['connectorDetails'];
  certificateFormGroup = this.form.formGroup.controls['certificate'];

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    public form: RegisterConnectorForm,
    private certificateGenerateService: CertificateGenerateService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(Reset);
    this.startListeningToState();
  }

  private startListeningToState() {
    this.store
      .select<ParticipantRegisterOwnConnectorPageState>(
        ParticipantRegisterOwnConnectorPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  /**
   * Generate a certificate based on the form values
   */
  generateCertificate() {
    this.isGenerating = true;
    this.keyPair = this.certificateGenerateService.generateKeyPair(2048);
    this.publicKeyPem = this.certificateGenerateService.publicKeyToPem(
      this.keyPair.publicKey,
    );
    this.privateKeyPem = this.certificateGenerateService.privateKeyToPem(
      this.keyPair.privateKey,
    );
    this.connectorDetailsFormGroup.controls['certificate'].setValue(
      this.publicKeyPem,
    );
    this.certificateFormGroup.controls['certificate'].setValue(
      this.publicKeyPem,
    );
    this.isDownloadActive = true;
    this.isGenerating = false;
  }

  /**
   * Download the generated key based on the type
   * @param type
   */
  downloadKey(type: 'PRIVATE_KEY' | 'PUBLIC_KEY') {
    this.hasDownloadedKey = true;
    switch (type) {
      case 'PRIVATE_KEY':
        downloadFile('private_key.pem', this.privateKeyPem, 'text/plain');
        break;
      case 'PUBLIC_KEY':
        downloadFile('public_key.pem', this.publicKeyPem, 'text/plain');
        break;
    }
  }

  submit(): void {
    if (!this.hasDownloadedKey) {
      downloadFile('private_key.pem', this.privateKeyPem, 'text/plain');
      downloadFile('public_key.pem', this.publicKeyPem, 'text/plain');
    }
    this.connectorDetailsFormGroup.disable();
    this.store.dispatch(
      new Submit(
        this.form.connectorDetailsValue,
        () => this.connectorDetailsFormGroup.enable(),
        () => this.connectorDetailsFormGroup.disable(),
      ),
    );
  }

  onStepChange(event: number) {
    if (event > 1) {
      this.isLinear = false; // to enable user go back and generate a new key
      this.connectorDetailsFormGroup.controls['certificate'].addValidators(
        Validators.required,
      );
      this.connectorDetailsFormGroup.controls['certificate'].addValidators(
        Validators.pattern(
          /^(-----BEGIN PUBLIC KEY-----)[\s\S]*?(-----END PUBLIC KEY-----)\s*$/m,
        ),
      );
    } else {
      this.isLinear = true; // to disable navigating other steps without validation
      this.connectorDetailsFormGroup.controls['certificate'].clearValidators();
    }
    this.connectorDetailsFormGroup.controls[
      'certificate'
    ].updateValueAndValidity();
  }

  clearCertificate() {
    this.certificateFormGroup.reset();
    this.connectorDetailsFormGroup.controls['certificate'].reset();
    if (this.hasCertificate) {
      this.certificateFormGroup.disable();
      this.isDownloadActive = false;
    } else {
      this.certificateFormGroup.enable();
    }
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
