import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {
  Component,
  ElementRef,
  HostBinding,
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
import {
  GetOrganizations,
  Reset,
  Submit,
} from '../state/provide-connector-page-actions';
import {
  DEFAULT_PROVIDE_CONNECTOR_STATE,
  ProvideConnectorPageState,
} from '../state/provide-connector-page-state';
import {ProvideConnectorPageStateImpl} from '../state/provide-connector-page-state-impl';
import {ProvideConnectorForm} from './provide-connector-form';
import {PredefinedCertificateValues} from './provide-connector-page-form-model';

@Component({
  selector: 'app-provide-connector-page',
  templateUrl: './provide-connector-page.component.html',
  providers: [ProvideConnectorForm],
})
export class ProvideConnectorPageComponent implements OnInit, OnDestroy {
  @HostBinding('class.overflow-y-auto') overflowYAuto = true;
  state = DEFAULT_PROVIDE_CONNECTOR_STATE;
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
    public form: ProvideConnectorForm,
    private globalStateUtils: GlobalStateUtils,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(GetOrganizations);
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

  private startListeningToState() {
    this.store
      .select<ProvideConnectorPageState>(ProvideConnectorPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  registerConnector(): void {
    this.stepperFormGroup.controls.submitConnector.setValue(true);
    this.connectorDetailsFormGroup.disable();
    const mdsId = this.form.connectorDetailsValue.mdsId;
    this.store.dispatch(
      new Submit(
        {
          ...this.form.connectorDetailsValue,
          certificate: this.form.certificateValue.certificate,
        },
        mdsId,
        () => this.connectorDetailsFormGroup.enable(),
        () => this.connectorDetailsFormGroup.disable(),
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
