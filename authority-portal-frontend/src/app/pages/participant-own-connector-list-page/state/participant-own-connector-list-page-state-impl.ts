import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, map, tap} from 'rxjs/operators';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {GetOwnOrganizationConnectors} from './participant-own-connector-list-page-actions';
import {
  DEFAULT_PARTICIPANT_OWN_CONNECTOR_LIST_PAGE_STATE,
  ParticipantOwnConnectorListPageState,
} from './participant-own-connector-list-page-state';

@State<ParticipantOwnConnectorListPageState>({
  name: 'ParticipantOwnConnectorListPageState',
  defaults: DEFAULT_PARTICIPANT_OWN_CONNECTOR_LIST_PAGE_STATE,
})
@Injectable()
export class ParticipantOwnConnectorListPageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(GetOwnOrganizationConnectors)
  onGetOwnOrganizationConnectors(
    ctx: StateContext<ParticipantOwnConnectorListPageState>,
  ): Observable<never> {
    return this.apiService.getOwnOrganizationConnectors().pipe(
      map((result) => result.connectors),
      Fetched.wrap({failureMessage: 'Failed loading connectors'}),
      tap((connectors) => this.connectorsRefreshed(ctx, connectors)),
      ignoreElements(),
    );
  }

  private connectorsRefreshed(
    ctx: StateContext<ParticipantOwnConnectorListPageState>,
    newConnectors: Fetched<ConnectorOverviewEntryDto[]>,
  ) {
    ctx.patchState({connectors: newConnectors});
  }
}
