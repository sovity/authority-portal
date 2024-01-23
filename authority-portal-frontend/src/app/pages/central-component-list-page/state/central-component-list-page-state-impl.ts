import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {filter, finalize, ignoreElements, switchMap, takeUntil, tap,} from 'rxjs/operators';
import {Action, Actions, State, StateContext} from '@ngxs/store';
import {CentralComponentDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  ConfirmDeleteCentralComponent,
  DismissDeleteCentralComponentModal,
  RefreshCentralComponents,
  ShowDeleteCentralComponentModal,
} from './central-component-list-page-actions';
import {
  CentralComponentListPageState,
  DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE,
} from './central-component-list-page-state';

@State<CentralComponentListPageState>({
  name: 'CentralComponentListPageState',
  defaults: DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE,
})
@Injectable()
export class CentralComponentListPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(RefreshCentralComponents)
  onRefreshCentralComponents(
    ctx: StateContext<CentralComponentListPageState>,
  ): Observable<never> {
    return this.fetchCentralComponents().pipe(
      Fetched.wrap({failureMessage: 'Failed loading central components'}),
      tap((centralComponents) =>
        ctx.patchState({centralComponents: centralComponents}),
      ),
      ignoreElements(),
    );
  }
  @Action(ShowDeleteCentralComponentModal)
  onShowDeleteCentralComponentModal(
    ctx: StateContext<CentralComponentListPageState>,
    action: ShowDeleteCentralComponentModal,
  ): void {
    ctx.patchState({deleteConfirmation: action.centralComponent});
  }

  @Action(DismissDeleteCentralComponentModal)
  onDismissDeleteCentralComponentModal(
    ctx: StateContext<CentralComponentListPageState>,
  ): void {
    ctx.patchState({deleteConfirmation: null});
  }

  @Action(ConfirmDeleteCentralComponent)
  onConfirmDeleteCentralComponent(
    ctx: StateContext<CentralComponentListPageState>,
  ): Observable<never> {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    let centralComponent = ctx.getState().deleteConfirmation!;
    ctx.patchState({
      deleteConfirmation: null,
      busy: true,
      busyDeletingComponentId: centralComponent.centralComponentId,
    });

    return this.apiService
      .deleteCentralComponent(centralComponent.centralComponentId)
      .pipe(
        switchMap(() => this.fetchCentralComponents()),
        takeUntil(
          this.actions$.pipe(
            filter((action) => action instanceof RefreshCentralComponents),
          ),
        ),
        this.errorService.toastFailureRxjs("Central Component wasn't deleted"),
        tap((data) => {
          ctx.patchState({centralComponents: Fetched.ready(data)});
          this.toast.showSuccess(
            `Central Component ${centralComponent.name} was successfully deleted`,
          );
        }),
        finalize(() =>
          ctx.patchState({busy: false, busyDeletingComponentId: null}),
        ),
        ignoreElements(),
      );
  }

  private fetchCentralComponents(): Observable<CentralComponentDto[]> {
    return this.globalStateUtils
      .getDeploymentEnvironmentId()
      .pipe(
        switchMap((deploymentEnvironmentId) =>
          this.apiService.getCentralComponents(deploymentEnvironmentId),
        ),
      );
  }
}
