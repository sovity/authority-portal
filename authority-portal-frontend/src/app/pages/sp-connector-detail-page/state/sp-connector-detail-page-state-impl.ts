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
import {ConnectorDetailsDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  RefreshConnector,
  RefreshConnectorSilent,
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

  @Action(RefreshConnectorSilent, {cancelUncompleted: true})
  onRefreshConnectorSilent(
    ctx: StateContext<SpConnectorDetailPageState>,
  ): Observable<never> {
    return this.apiService
      .getProvidedConnectorDetails(ctx.getState().connectorId)
      .pipe(
        catchError(() => EMPTY),
        tap((connector) =>
          this.connectorRefreshed(ctx, Fetched.ready(connector)),
        ),
        ignoreElements(),
      );
  }

  private connectorRefreshed(
    ctx: StateContext<SpConnectorDetailPageState>,

    connector: Fetched<ConnectorDetailsDto>,
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
