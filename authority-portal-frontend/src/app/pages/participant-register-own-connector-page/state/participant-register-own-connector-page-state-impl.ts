import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {catchError, ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {IdResponse} from '@sovity.de/authority-portal-client';
import {INITIAL_GLOBAL_STATE_MODEL} from 'src/app/core/global-state/global-state';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {DEFAULT_ORGANIZATION_CREATE_PAGE_STATE} from '../../registration-process-wizard/organization-create-page/state/organization-create-page-state';
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
  constructor(private apiService: ApiService, private actions$: Actions) {}

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
      tap(() => ctx.patchState({state: 'success'})),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      catchError((error) => {
        console.error('Failed registering connector', error);
        ctx.patchState({state: 'error'});
        action.enableForm();
        return EMPTY;
      }),
      ignoreElements(),
    );
  }
}
