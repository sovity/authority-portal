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
import {
  catchError,
  filter,
  finalize,
  ignoreElements,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {Action, Actions, State, StateContext} from '@ngxs/store';
import {ConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ErrorService} from 'src/app/core/services/error.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {ToastService} from 'src/app/shared/common/toast-notifications/toast.service';
import {
  CloseConnectorDetail,
  DeleteConnector,
  GetConnectors,
  GetConnectorsSilent,
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
    private actions$: Actions,
    private errorService: ErrorService,
    private toast: ToastService,
  ) {}

  @Action(GetConnectors)
  onGetConnectors(
    ctx: StateContext<AuthorityConnectorListPageState>,
  ): Observable<never> {
    ctx.patchState({showDetail: false});
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

  @Action(GetConnectorsSilent)
  onGetConnectorsSilent(
    ctx: StateContext<AuthorityConnectorListPageState>,
  ): Observable<never> {
    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getAllConnectors(deploymentEnvironmentId),
      ),
      map((result) => result.connectors),
      catchError((error) => EMPTY),
      tap((connectors) =>
        this.connectorsRefreshed(ctx, Fetched.ready(connectors)),
      ),
      ignoreElements(),
    );
  }

  private connectorsRefreshed(
    ctx: StateContext<AuthorityConnectorListPageState>,
    newConnectors: Fetched<ConnectorOverviewEntryDto[]>,
  ) {
    ctx.patchState({connectors: newConnectors});
  }

  @Action(DeleteConnector)
  onDeleteConnector(
    ctx: StateContext<AuthorityConnectorListPageState>,
    action: DeleteConnector,
  ): Observable<never> {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    ctx.patchState({busy: true});

    return this.apiService.deleteOwnConnector(action.connectorId).pipe(
      switchMap(() => this.globalStateUtils.getDeploymentEnvironmentId()),
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getAllConnectors(deploymentEnvironmentId),
      ),
      takeUntil(
        this.actions$.pipe(filter((action) => action instanceof GetConnectors)),
      ),
      this.errorService.toastFailureRxjs('Deleting connector failed'),
      map((result) => result.connectors),
      tap((data) => {
        this.connectorsRefreshed(ctx, Fetched.ready(data));
        this.toast.showSuccess(
          `Connector ${action.connectorId} was successfully deleted`,
        );
        ctx.dispatch(CloseConnectorDetail);
      }),
      finalize(() => ctx.patchState({busy: false})),
      ignoreElements(),
    );
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
