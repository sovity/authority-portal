import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ignoreElements, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {CreateConnectorResponse} from '@sovity.de/authority-portal-client';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Reset, Submit} from './provide-connector-page-actions';
import {
  DEFAULT_PROVIDE_CONNECTOR_STATE,
  ProvideConnectorPageState,
} from './provide-connector-page-state';

@State<ProvideConnectorPageState>({
  name: 'ProvideConnectorPage',
  defaults: DEFAULT_PROVIDE_CONNECTOR_STATE,
})
@Injectable()
export class ProvideConnectorPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private router: Router,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<ProvideConnectorPageState>): void {
    ctx.setState(DEFAULT_PROVIDE_CONNECTOR_STATE);
  }

  @Action(Submit, {cancelUncompleted: true})
  onSubmit(
    ctx: StateContext<ProvideConnectorPageState>,
    action: Submit,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();

    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap(
        (deploymentEnvironmentId): Observable<CreateConnectorResponse> =>
          this.apiService.createProvidedConnector(
            action.request,
            action.mdsId,
            deploymentEnvironmentId,
          ),
      ),
      tap((res) => {
        switch (res.status) {
          case 'OK':
            this.toast.showSuccess(
              `Connector ${action.request.name} was successfully provided`,
            );
            ctx.patchState({state: 'success'});
            this.router.navigate(['/my-organization', 'connectors']);
            break;
          case 'WARNING':
            this.toast.showWarning(
              res?.message ||
                'A problem occurred while providing the connector.',
            );
            ctx.patchState({state: 'success'});
            this.router.navigate(['/my-organization', 'connectors']);
            break;
          case 'ERROR':
            this.toast.showDanger(res?.message || 'Failed providing connector');
            ctx.patchState({state: 'error'});
            action.enableForm();
            break;
        }
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Failed providing connector', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }
}
