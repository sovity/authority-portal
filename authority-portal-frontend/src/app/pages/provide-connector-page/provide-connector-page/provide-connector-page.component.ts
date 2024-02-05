import {Component, HostBinding, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  CreateConnectorRequest,
  UserInfo,
} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {certificateValidator} from '../../../core/utils/validators/certificate-validator';
import {urlValidator} from '../../../core/utils/validators/url-validator';
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
})
export class ProvideConnectorPageComponent implements OnInit, OnDestroy {
  @HostBinding('class.overflow-y-auto') cls = true;
  state = DEFAULT_PROVIDE_CONNECTOR_STATE;
  group = this.buildFormGroup();
  userInfo!: UserInfo;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    private formBuilder: FormBuilder,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit(): void {
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

  buildFormGroup(): FormGroup<ProvideConnectorPageFormModel> {
    const initial = DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE;
    return this.formBuilder.nonNullable.group({
      name: [initial.name, [Validators.required]],
      location: [initial.location, [Validators.required]],
      frontendUrl: [initial.frontendUrl, [Validators.required, urlValidator]],
      endpointUrl: [initial.endpointUrl, [Validators.required, urlValidator]],
      managementUrl: [
        initial.managementUrl,
        [Validators.required, urlValidator],
      ],
      mdsId: [initial.mdsId, [Validators.required]],
      certificate: [
        initial.certificate,
        [Validators.required, certificateValidator],
      ],
    });
  }

  get value(): ProvideConnectorPageFormValue {
    return this.group.value as ProvideConnectorPageFormValue;
  }

  submit(): void {
    const formValue: ProvideConnectorPageFormValue = this.value;
    const mdsId = formValue.mdsId;
    const request: CreateConnectorRequest = {
      name: formValue.name,
      location: formValue.location,
      frontendUrl: formValue.frontendUrl,
      endpointUrl: formValue.endpointUrl,
      managementUrl: formValue.managementUrl,
      certificate: formValue.certificate,
    };

    this.group.disable();
    this.store.dispatch(
      new Submit(
        request,
        mdsId,
        () => this.group.enable(),
        () => this.group.disable(),
      ),
    );
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
