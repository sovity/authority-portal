import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ignoreElements, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Reset, Submit} from './central-component-create-page-actions';
import {
  CentralComponentCreatePageState,
  DEFAULT_CENTRAL_COMPONENT_CREATE_STATE,
} from './central-component-create-page-state';

@State<CentralComponentCreatePageState>({
  name: 'CentralComponentCreatePage',
  defaults: DEFAULT_CENTRAL_COMPONENT_CREATE_STATE,
})
@Injectable()
export class CentralComponentCreatePageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private router: Router,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<CentralComponentCreatePageState>): void {
    ctx.setState(DEFAULT_CENTRAL_COMPONENT_CREATE_STATE);
  }

  @Action(Submit, {cancelUncompleted: true})
  onSubmit(
    ctx: StateContext<CentralComponentCreatePageState>,
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
      tap(() => {
        this.toast.showSuccess(
          `Central Component '${action.request.name}' created successfully`,
        );
        ctx.patchState({state: 'success'});

        this.router.navigate(['/operator/central-components']);
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs(
        'Failed creating Central Component',
        () => {
          ctx.patchState({state: 'error'});
          action.enableForm();
        },
      ),
      ignoreElements(),
    );
  }
}
