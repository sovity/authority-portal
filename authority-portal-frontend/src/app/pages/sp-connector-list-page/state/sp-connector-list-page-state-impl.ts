import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {
  filter,
  finalize,
  ignoreElements,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {Action, Actions, State, StateContext, Store} from '@ngxs/store';
import {
  ConnectorOverviewEntryDto,
  ProvidedConnectorOverviewEntryDto,
} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  CloseConnectorDetail,
  DeleteProvidedConnector,
  GetProvidedConnectors,
  ShowConnectorDetail,
} from './sp-connector-list-page-actions';
import {
  DEFAULT_SP_CONNECTOR_LIST_PAGE_STATE,
  SpConnectorListPageState,
} from './sp-connector-list-page-state';

@State<SpConnectorListPageState>({
  name: 'SpConnectorListPageState',
  defaults: DEFAULT_SP_CONNECTOR_LIST_PAGE_STATE,
})
@Injectable()
export class SpConnectorListPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
    private store: Store,
  ) {}

  @Action(GetProvidedConnectors)
  onGetProvidedConnectors(
    ctx: StateContext<SpConnectorListPageState>,
  ): Observable<never> {
    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getProvidedConnectors(deploymentEnvironmentId),
      ),
      map((result) => result.connectors),
      Fetched.wrap({failureMessage: 'Failed loading connectors'}),
      tap((connectors) => this.connectorsRefreshed(ctx, connectors)),
      ignoreElements(),
    );
  }

  private connectorsRefreshed(
    ctx: StateContext<SpConnectorListPageState>,
    newConnectors: Fetched<ProvidedConnectorOverviewEntryDto[]>,
  ) {
    ctx.patchState({connectors: newConnectors});
  }

  @Action(DeleteProvidedConnector)
  onDeleteProvidedConnector(
    ctx: StateContext<SpConnectorListPageState>,
    action: DeleteProvidedConnector,
  ): Observable<never> {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    ctx.patchState({busy: true});

    return this.apiService.deleteProvidedConnector(action.connectorId).pipe(
      switchMap(() => this.globalStateUtils.getDeploymentEnvironmentId()),
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getProvidedConnectors(deploymentEnvironmentId),
      ),
      takeUntil(
        this.actions$.pipe(
          filter((action) => action instanceof GetProvidedConnectors),
        ),
      ),
      this.errorService.toastFailureRxjs("Connector wasn't deleted"),
      map((result) => result.connectors),
      tap((data) => {
        this.connectorsRefreshed(ctx, Fetched.ready(data));
        this.toast.showSuccess(
          `Connector ${action.connectorId} was successfully deleted`,
        );
        this.store.dispatch(CloseConnectorDetail);
      }),
      finalize(() => ctx.patchState({busy: false})),
      ignoreElements(),
    );
  }

  @Action(ShowConnectorDetail)
  onShowConnectorDetail(ctx: StateContext<SpConnectorListPageState>) {
    ctx.patchState({showDetail: true});
  }

  @Action(CloseConnectorDetail)
  onCloseConnectorDetail(ctx: StateContext<SpConnectorListPageState>) {
    ctx.patchState({showDetail: false});
  }
}
