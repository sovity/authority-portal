import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {catchError, ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {IdResponse} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {Reset, Submit} from './sp-register-connector-page-actions';
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
  constructor(private apiService: ApiService, private actions$: Actions) {}

  @Action(Submit, {cancelUncompleted: true})
  onRegisterConnector(
    ctx: StateContext<SpRegisterConnectorPageState>,
    action: Submit,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();
    return this.apiService
      .createProvidedConnector(action.request, action.mdsId)
      .pipe(
        tap(() => ctx.patchState({state: 'success'})),
        takeUntil(this.actions$.pipe(ofAction(Reset))),
        catchError((error) => {
          console.error('Provided connector registration failed', error);
          ctx.patchState({state: 'error'});
          action.enableForm();
          return EMPTY;
        }),
        ignoreElements(),
      );
  }

  @Action(Reset)
  onReset(ctx: StateContext<SpRegisterConnectorPageState>): void {
    ctx.setState(DEFAULT_SP_REGISTER_CONNECTOR_STATE);
  }
}
