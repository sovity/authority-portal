import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {IdResponse} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  CleanRegisterConnector,
  RegisterConnector,
} from './sp-register-connector-page-actions';
import {
  DEFAULT_SP_REGISTER_CONNECTOR_STATE,
  SpRegisterConnectorPageState,
} from './sp-register-connector-page-state';

@State<SpRegisterConnectorPageState>({
  name: 'RegisterConnectorPage',
  defaults: DEFAULT_SP_REGISTER_CONNECTOR_STATE,
})
@Injectable()
export class SpRegisterConnectorPageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(CleanRegisterConnector, {cancelUncompleted: true})
  onRefreshOrganizations(
    ctx: StateContext<SpRegisterConnectorPageState>,
    action: CleanRegisterConnector,
  ): void {
    ctx.patchState({
      registerConnectorForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {},
      },
      response: Fetched.empty(),
    });
  }

  @Action(RegisterConnector, {cancelUncompleted: true})
  onRegisterConnector(
    ctx: StateContext<SpRegisterConnectorPageState>,
    action: RegisterConnector,
  ): Observable<never> {
    return this.apiService
      .createProvidedConnector(action.formValue, action.mdsId)
      .pipe(
        Fetched.wrap({failureMessage: 'Failed registering connector'}),
        tap((response) => {
          if (response.state === 'ready' || response.state === 'error')
            this.onCreateConnector(ctx, response);
        }),
        ignoreElements(),
      );
  }

  onCreateConnector(
    ctx: StateContext<SpRegisterConnectorPageState>,
    response: Fetched<IdResponse>,
  ) {
    ctx.patchState({response});
  }
}
