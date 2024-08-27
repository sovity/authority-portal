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
import {Action, Actions, State, StateContext, Store} from '@ngxs/store';
import {ProvidedConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ErrorService} from 'src/app/core/services/error.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {ToastService} from 'src/app/shared/common/toast-notifications/toast.service';
import {
  CloseConnectorDetail,
  DeleteProvidedConnector,
  GetProvidedConnectors,
  GetProvidedConnectorsSilent,
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

  @Action(GetProvidedConnectorsSilent)
  onGetProvidedConnectorsSilent(
    ctx: StateContext<SpConnectorListPageState>,
  ): Observable<never> {
    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getProvidedConnectors(deploymentEnvironmentId),
      ),
      map((result) => result.connectors),
      catchError(() => EMPTY),
      tap((connectors) =>
        this.connectorsRefreshed(ctx, Fetched.ready(connectors)),
      ),
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
