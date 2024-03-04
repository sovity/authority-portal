import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {CaasAvailabilityResponse} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {Reset, Submit} from '../state/request-connector-page-actions';
import {
  DEFAULT_REQUEST_CONNECTOR_STATE,
  RequestConnectorPageState,
} from '../state/request-connector-page-state';
import {RequestConnectorPageStateImpl} from '../state/request-connector-page-state-impl';
import {RequestConnectorPageForm} from './request-connector-page-form';

@Component({
  selector: 'app-request-connector-page',
  templateUrl: './request-connector-page.component.html',
  providers: [RequestConnectorPageForm],
})
export class RequestConnectorPageComponent implements OnInit {
  state = DEFAULT_REQUEST_CONNECTOR_STATE;
  requestConnectorPageForm = this.form.formGroup.controls;

  createActionName = 'Request CaaS';
  backLink = '/my-organization/connectors/new/choose-provider';

  private ngOnDestroy$ = new Subject();

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    public form: RequestConnectorPageForm,
    private store: Store,
    private apiService: ApiService,
    private globalStateUtils: GlobalStateUtils,
    private router: Router,
  ) {}

  ngOnInit() {
    this.redirectIfOverCaasLimits();
    this.startListeningToState();
    this.store.dispatch(Reset);
  }

  requestCaas(): void {
    this.form.formGroup.disable();
    this.store.dispatch(
      new Submit(
        {
          ...this.form.getValue,
        },
        () => this.form.formGroup.enable(),
        () => this.form.formGroup.disable(),
      ),
    );
  }

  redirectIfOverCaasLimits() {
    this.globalStateUtils
      .getDeploymentEnvironmentId()
      .pipe(
        switchMap(
          (deploymentEnvironmentId): Observable<CaasAvailabilityResponse> =>
            this.apiService.checkFreeCaasUsage(deploymentEnvironmentId),
        ),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe((x) => {
        if ((x.current ?? 0) >= (x.limit ?? -1)) {
          this.router.navigate([
            '/my-organization',
            'connectors',
            'registration',
          ]);
        }
      });
  }

  startListeningToState() {
    this.store
      .select<RequestConnectorPageState>(RequestConnectorPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
