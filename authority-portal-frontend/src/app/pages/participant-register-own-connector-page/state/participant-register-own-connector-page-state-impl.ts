import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {
  catchError,
  ignoreElements,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Reset, Submit} from './participant-register-own-connector-page-actions';
import {
  DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE,
  ParticipantRegisterOwnConnectorPageState,
} from './participant-register-own-connector-page-state';

@State<ParticipantRegisterOwnConnectorPageState>({
  name: 'RegisterOwnConnectorPage',
  defaults: DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE,
})
@Injectable()
export class ParticipantRegisterOwnConnectorPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private router: Router,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<ParticipantRegisterOwnConnectorPageState>): void {
    ctx.setState(DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE);
  }

  @Action(Submit, {cancelUncompleted: true})
  onSubmit(
    ctx: StateContext<ParticipantRegisterOwnConnectorPageState>,
    action: Submit,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();

    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.createOwnConnector(
          action.request,
          deploymentEnvironmentId,
        ),
      ),
      tap(() => {
        this.toast.showSuccess(
          `Connector ${action.request.name} created successfully`,
        );
        ctx.patchState({state: 'success'});

        this.router.navigate(['/my-organization', 'connectors']);
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Failed registering connector', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }
}
