import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, map, switchMap, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {ConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  CloseConnectorDetail,
  GetConnectors,
  ShowConnectorDetail,
} from './authority-connector-list-page-actions';
import {
  AuthorityConnectorListPageState,
  DEFAULT_AUTHORITY_CONNECTOR_LIST_PAGE_STATE,
} from './authority-connector-list-page-state';

@State<AuthorityConnectorListPageState>({
  name: 'AuthorityConnectorListPageState',
  defaults: DEFAULT_AUTHORITY_CONNECTOR_LIST_PAGE_STATE,
})
@Injectable()
export class AuthorityConnectorListPageStateImpl {
  constructor(
    private apiService: ApiService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(GetConnectors)
  onGetConnectors(
    ctx: StateContext<AuthorityConnectorListPageState>,
  ): Observable<never> {
    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getAllConnectors(deploymentEnvironmentId),
      ),
      map((result) => result.connectors),
      Fetched.wrap({failureMessage: 'Failed loading connectors'}),
      tap((connectors) => this.connectorsRefreshed(ctx, connectors)),
      ignoreElements(),
    );
  }

  private connectorsRefreshed(
    ctx: StateContext<AuthorityConnectorListPageState>,
    newConnectors: Fetched<ConnectorOverviewEntryDto[]>,
  ) {
    ctx.patchState({connectors: newConnectors});
  }

  @Action(ShowConnectorDetail)
  onShowConnectorDetail(ctx: StateContext<AuthorityConnectorListPageState>) {
    ctx.patchState({showDetail: true});
  }

  @Action(CloseConnectorDetail)
  onCloseConnectorDetail(ctx: StateContext<AuthorityConnectorListPageState>) {
    ctx.patchState({showDetail: false});
  }
}
