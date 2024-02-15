import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {PredefinedCertificateValues} from '../../participant-register-own-connector-page/participant-register-own-connector-page-form-model';
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
  stepperFormGroup!: FormGroup;
  hasCertificate: boolean = false;
  userInfo!: UserInfo;
  predefinedValues!: PredefinedCertificateValues;
  enableSubmitButton: boolean = false;

  connectorDetailsFormGroup = this.form.formGroup.controls.connectorDetails;
  certificateFormGroup = this.form.formGroup.controls.certificate;

  @ViewChild('tokenUrlElement') tokenUrlElement!: ElementRef;
  @ViewChild('jwksUrlElement') jwksUrlElement!: ElementRef;
  @ViewChild('stepper') stepper!: MatStepper;

  urlString = `https://{{Your Connector}}`;

  private ngOnDestroy$ = new Subject();

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    public form: RegisterConnectorForm,
    private globalStateUtils: GlobalStateUtils,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.disableStepperHeader();
    this.store.dispatch(Reset);
    this.startListeningToState();
    this.getUserInfo();
  }

  getUserInfo() {
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo: UserInfo) => {
        this.userInfo = userInfo;
      });
  }

  startListeningToState() {
    this.store
      .select<ParticipantRegisterOwnConnectorPageState>(
        ParticipantRegisterOwnConnectorPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  registerConnector(): void {
    this.stepperFormGroup.controls.submitConnector.setValue(true);
    this.form.formGroup.disable();
    this.store.dispatch(
      new Submit(
        {
          ...this.form.connectorDetailsValue,
          certificate: this.form.certificateValue.certificate,
        },
        () => this.form.formGroup.enable(),
        () => this.form.formGroup.disable(),
      ),
    );
    this.stepper.next();
  }

  /**
   * This method prepares the Generate Certificate step
   * @param goToNext if true move to next step, if not it means the method is called while moving to the next step so no need to call it again
   */
  onConnectorDetailCollected(goToNext: boolean) {
    this.predefinedValues = {
      country: this.connectorDetailsFormGroup.controls.location.value,
      organizationalName: this.userInfo.organizationName,
      commonName: this.connectorDetailsFormGroup.controls.endpointUrl.value,
    };
    if (goToNext) this.stepper.next();
  }

  generatedCertificateHandler(certificate: string) {
    if (!certificate || certificate == '') return;
    this.enableSubmitButton = true;
    this.certificateFormGroup.controls.certificate.setValue(certificate);
    this.certificateFormGroup.controls.certificate.disable();
  }

  clearCertificateForm() {
    this.certificateFormGroup.controls.certificate.reset();

    if (this.hasCertificate) {
      this.enableSubmitButton = true;
      this.certificateFormGroup.controls.certificate.enable();
    } else {
      this.certificateFormGroup.controls.certificate.disable();
      this.enableSubmitButton = false;
    }
  }

  /**
   * if users are stepping to Generate Certificate, method, the onConnectorDetailCollected should be called
   * @param event
   */
  onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) this.onConnectorDetailCollected(false);
  }

  copyToClipboard() {
    const tokenUrl = this.tokenUrlElement.nativeElement.innerText.trim();
    const jwksUrl = this.jwksUrlElement.nativeElement.innerText.trim();

    const combinedValue = `${tokenUrl}\n${jwksUrl}`;
    const textarea = document.createElement('textarea');
    textarea.value = combinedValue;

    // Append the textarea to the document
    document.body.appendChild(textarea);
    textarea.select();
    navigator.clipboard.writeText(combinedValue);
    // Remove the textarea from the document
    document.body.removeChild(textarea);
  }

  goToGithub() {
    const externalLink = 'https://github.com'; // Replace with your external link
    window.open(externalLink, '_blank');
  }

  disableStepperHeader() {
    // this is to disable navigation with the stepper header
    this.stepperFormGroup = this.formBuilder.group({
      submitConnector: [false, [Validators.requiredTrue]],
    });
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
