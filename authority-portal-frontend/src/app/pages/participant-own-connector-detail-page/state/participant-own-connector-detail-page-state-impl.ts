import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext} from '@ngxs/store';
import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  RefreshConnector,
  SetConnectorId,
} from './participant-own-connector-detail-page-actions';
import {
  DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE,
  ParticipantOwnConnectorDetailPageState,
} from './participant-own-connector-detail-page-state';

@State<ParticipantOwnConnectorDetailPageState>({
  name: 'ParticipantOwnConnectorDetailPageState',
  defaults: DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE,
})
@Injectable()
export class ParticipantOwnConnectorDetailPageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(RefreshConnector, {cancelUncompleted: true})
  onRefreshConnector(
    ctx: StateContext<ParticipantOwnConnectorDetailPageState>,
    action: RefreshConnector,
  ): Observable<never> {
    return this.apiService
      .getOwnOrganizationConnectorDetails(ctx.getState().connectorId)
      .pipe(
        Fetched.wrap({failureMessage: 'Failed loading Connector'}),
        tap((connector) => this.connectorRefreshed(ctx, connector)),
        ignoreElements(),
      );
  }

  private connectorRefreshed(
    ctx: StateContext<ParticipantOwnConnectorDetailPageState>,
    connector: Fetched<ConnectorDetailDto>,
  ) {
    ctx.patchState({connector});
  }

  @Action(SetConnectorId, {cancelUncompleted: true})
  onSetConnectorId(
    ctx: StateContext<ParticipantOwnConnectorDetailPageState>,
    action: SetConnectorId,
  ) {
    ctx.patchState({connectorId: action.connectorId});
  }
}