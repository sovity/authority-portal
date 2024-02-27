import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../../core/api/api.service';
import {Reset, Submit} from './register-central-component-page-actions';
import {
  DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_STATE,
  RegisterCentralComponentPageState,
} from './register-central-component-page-state';

@State<RegisterCentralComponentPageState>({
  name: 'RegisterCentralComponentPage',
  defaults: DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_STATE,
})
@Injectable()
export class RegisterCentralComponentPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<RegisterCentralComponentPageState>): void {
    ctx.setState(DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_STATE);
  }

  @Action(Submit, {cancelUncompleted: true})
  onSubmit(
    ctx: StateContext<RegisterCentralComponentPageState>,
    action: Submit,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();

    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.createCentralComponent(
          deploymentEnvironmentId,
          action.request,
        ),
      ),
      tap((res) => {
        ctx.patchState({state: 'success', createdCentralComponentId: res.id});
        action.success();
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs(
        'Failed registering the central component',
        () => {
          ctx.patchState({state: 'error'});
          action.enableForm();
        },
      ),
      ignoreElements(),
    );
  }
}
