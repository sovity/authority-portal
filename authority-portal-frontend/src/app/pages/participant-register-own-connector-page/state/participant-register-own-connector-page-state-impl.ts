import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {catchError, ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {ErrorService} from 'src/app/core/error.service';
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

    return this.apiService.createOwnConnector(action.request).pipe(
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
