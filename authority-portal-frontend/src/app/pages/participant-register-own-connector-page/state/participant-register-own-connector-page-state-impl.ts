import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {IdResponse} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  CleanRegisterOwnConnector,
  RegisterOwnConnector,
} from './participant-register-own-connector-page-actions';
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
  constructor(private apiService: ApiService) {}

  @Action(CleanRegisterOwnConnector, {cancelUncompleted: true})
  onRefreshOrganizations(
    ctx: StateContext<ParticipantRegisterOwnConnectorPageState>,
    action: CleanRegisterOwnConnector,
  ): void {
    ctx.patchState({
      registerOwnConnectorForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {},
      },
      response: Fetched.empty(),
    });
  }

  @Action(RegisterOwnConnector, {cancelUncompleted: true})
  onRegisterOwnConnector(
    ctx: StateContext<ParticipantRegisterOwnConnectorPageState>,
    action: RegisterOwnConnector,
  ): Observable<never> {
    return this.apiService.createOwnConnector(action.formValue).pipe(
      Fetched.wrap({failureMessage: 'Failed registering connector'}),
      tap((response) => {
        if (response.state === 'ready' || response.state === 'error')
          this.onCreateOwnConnector(ctx, response);
      }),
      ignoreElements(),
    );
  }

  onCreateOwnConnector(
    ctx: StateContext<ParticipantRegisterOwnConnectorPageState>,
    response: Fetched<IdResponse>,
  ) {
    ctx.patchState({response});
  }
}
