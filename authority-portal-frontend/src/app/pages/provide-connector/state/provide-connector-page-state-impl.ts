import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Reset, Submit} from './provide-connector-page-actions';
import {
  DEFAULT_PROVIDE_CONNECTOR_STATE,
  ProvideConnectorPageState,
} from './provide-connector-page-state';

@State<ProvideConnectorPageState>({
  name: 'RegisterConnectorPage',
  defaults: DEFAULT_PROVIDE_CONNECTOR_STATE,
})
@Injectable()
export class ProvideConnectorPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private errorService: ErrorService,
    private router: Router,
  ) {}

  @Action(Submit, {cancelUncompleted: true})
  onRegisterConnector(
    ctx: StateContext<ProvideConnectorPageState>,
    action: Submit,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();
    return this.apiService
      .createProvidedConnector(action.request, action.mdsId)
      .pipe(
        tap(() => {
          this.toast.showSuccess(
            `Connector ${action.request.name} was successfully provided`,
          );
          ctx.patchState({state: 'success'});
          this.router.navigate(['/my-organization', 'connectors']);
        }),
        takeUntil(this.actions$.pipe(ofAction(Reset))),
        this.errorService.toastFailureRxjs(
          "Connector couldn't be provided. Please try again.",
          () => {
            action.enableForm();
            ctx.patchState({state: 'editing'});
          },
        ),
        ignoreElements(),
      );
  }

  @Action(Reset)
  onReset(ctx: StateContext<ProvideConnectorPageState>): void {
    ctx.setState(DEFAULT_PROVIDE_CONNECTOR_STATE);
  }
}
