import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  CentralComponentCreateRequest,
  UserInfo,
} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {copyToClipboard} from '../../../../core/utils/clipboard-utils';
import {DEFAULT_PROVIDE_CONNECTOR_PAGE_STATE} from '../../provide-connector-page/state/provide-connector-page-state';
import {Reset, Submit} from '../state/register-central-component-page-actions';
import {
  DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_STATE,
  RegisterCentralComponentPageState,
} from '../state/register-central-component-page-state';
import {RegisterCentralComponentPageStateImpl} from '../state/register-central-component-page-state-impl';
import {RegisterCentralComponentPageForm} from './register-central-component-page-form';

@Component({
  selector: 'app-register-central-component-page',
  templateUrl: './register-central-component-page.component.html',
  providers: [RegisterCentralComponentPageForm],
})
export class RegisterCentralComponentPageComponent
  implements OnInit, OnDestroy
{
  @HostBinding('class.overflow-y-auto')
  cls = true;
  state = DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_STATE;
  userInfo!: UserInfo;

  createActionName = 'Register Central Component';
  exitLink = '/operator/central-components';

  @ViewChild('stepper') stepper!: MatStepper;

  private ngOnDestroy$ = new Subject();

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    public form: RegisterCentralComponentPageForm,
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

  copyToClipboard() {
    copyToClipboard(this.state.createdCentralComponentId || '');
  }

  private startListeningToState() {
    this.store
      .select<RegisterCentralComponentPageState>(
        RegisterCentralComponentPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  registerComponent(): void {
    const formValue = this.form.value;
    let request: CentralComponentCreateRequest = {
      name: formValue.componentTab.name,
      endpointUrl: formValue.componentTab.endpointUrl,
      homepageUrl: formValue.componentTab.frontendUrl,
      certificate: formValue.certificateTab.bringOwnCert
        ? formValue.certificateTab.ownCertificate
        : formValue.certificateTab.generatedCertificate,
    };
    this.store.dispatch(
      new Submit(
        request,
        () => this.form.group.enable(),
        () => this.form.group.disable(),
        () => this.stepper.next(),
      ),
    );
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
