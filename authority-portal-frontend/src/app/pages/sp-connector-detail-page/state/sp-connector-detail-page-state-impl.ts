import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  RefreshConnector,
  SetConnectorId,
} from './sp-connector-detail-page-actions';
import {
  DEFAULT_SP_CONNECTOR_DETAIL_PAGE_STATE,
  SpConnectorDetailPageState,
} from './sp-connector-detail-page-state';

@State<SpConnectorDetailPageState>({
  name: 'SpConnectorDetailPageState',
  defaults: DEFAULT_SP_CONNECTOR_DETAIL_PAGE_STATE,
})
@Injectable()
export class SpConnectorDetailPageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(RefreshConnector, {cancelUncompleted: true})
  onRefreshConnector(
    ctx: StateContext<SpConnectorDetailPageState>,
  ): Observable<never> {
    return this.apiService
      .getProvidedConnectorDetails(ctx.getState().connectorId)
      .pipe(
        Fetched.wrap({failureMessage: 'Failed loading Connector'}),
        tap((connector) => this.connectorRefreshed(ctx, connector)),
        ignoreElements(),
      );
  }

  private connectorRefreshed(
    ctx: StateContext<SpConnectorDetailPageState>,

    connector: Fetched<ConnectorDetailDto>,
  ) {
    ctx.patchState({connector});
  }

  @Action(SetConnectorId, {cancelUncompleted: true})
  onSetConnectorId(
    ctx: StateContext<SpConnectorDetailPageState>,
    action: SetConnectorId,
  ) {
    ctx.patchState({connectorId: action.connectorId});
  }
}
