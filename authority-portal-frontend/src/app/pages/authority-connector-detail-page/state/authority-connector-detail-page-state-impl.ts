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
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  RefreshConnector,
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

  private connectorRefreshed(
    ctx: StateContext<AuthorityConnectorDetailPageState>,
    connector: Fetched<ConnectorDetailDto>,
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
