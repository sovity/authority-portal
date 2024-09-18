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
} from './authority-connector-detail-page-actions';
import {
  AuthorityConnectorDetailPageState,
  DEFAULT_AUTHORITY_CONNECTOR_DETAIL_PAGE_STATE,
} from './authority-connector-detail-page-state';

@State<AuthorityConnectorDetailPageState>({
  name: 'AuthorityConnectorDetailPageState',
  defaults: DEFAULT_AUTHORITY_CONNECTOR_DETAIL_PAGE_STATE,
})
@Injectable()
export class AuthorityConnectorDetailPageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(RefreshConnector, {cancelUncompleted: true})
  onRefreshConnector(
    ctx: StateContext<AuthorityConnectorDetailPageState>,
  ): Observable<never> {
    return this.apiService.getConnector(ctx.getState().connectorId).pipe(
      Fetched.wrap({failureMessage: 'Failed loading Connector'}),
      tap((connector) => this.connectorRefreshed(ctx, connector)),
      ignoreElements(),
    );
  }

  @Action(RefreshConnectorSilent)
  onRefreshConnectorSilent(
    ctx: StateContext<AuthorityConnectorDetailPageState>,
  ): Observable<never> {
    return this.apiService.getConnector(ctx.getState().connectorId).pipe(
      catchError(() => EMPTY),
      tap((connector) =>
        this.connectorRefreshed(ctx, Fetched.ready(connector)),
      ),
      ignoreElements(),
    );
  }

  private connectorRefreshed(
    ctx: StateContext<AuthorityConnectorDetailPageState>,
    connector: Fetched<ConnectorDetailsDto>,
  ) {
    ctx.patchState({connector});
  }

  @Action(SetConnectorId, {cancelUncompleted: true})
  onSetConnectorId(
    ctx: StateContext<AuthorityConnectorDetailPageState>,
    action: SetConnectorId,
  ) {
    ctx.patchState({connectorId: action.connectorId});
  }
}
