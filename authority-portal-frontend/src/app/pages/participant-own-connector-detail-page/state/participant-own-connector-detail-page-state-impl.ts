/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {catchError, ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  RefreshConnector,
  RefreshConnectorSilent,
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

  @Action(RefreshConnectorSilent, {cancelUncompleted: true})
  onRefreshConnectorSilent(
    ctx: StateContext<ParticipantOwnConnectorDetailPageState>,
    action: RefreshConnector,
  ): Observable<never> {
    return this.apiService
      .getOwnOrganizationConnectorDetails(ctx.getState().connectorId)
      .pipe(
        catchError(() => EMPTY),
        tap((connector) => {
          this.connectorRefreshed(ctx, Fetched.ready(connector));
        }),
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
