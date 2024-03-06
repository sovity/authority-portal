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
  filter,
  finalize,
  ignoreElements,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {Action, Actions, State, StateContext, Store} from '@ngxs/store';
import {ConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  CloseConnectorDetail,
  DeleteOwnConnector,
  GetOwnOrganizationConnectors,
  ShowConnectorDetail,
} from './participant-own-connector-list-page-actions';
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
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
    private store: Store,
  ) {}

  @Action(GetOwnOrganizationConnectors)
  onGetOwnOrganizationConnectors(
    ctx: StateContext<ParticipantOwnConnectorListPageState>,
  ): Observable<never> {
    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getOwnOrganizationConnectors(deploymentEnvironmentId),
      ),
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

  @Action(DeleteOwnConnector)
  onDeleteOwnConnector(
    ctx: StateContext<ParticipantOwnConnectorListPageState>,
    action: DeleteOwnConnector,
  ): Observable<never> {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    ctx.patchState({busy: true});

    return this.apiService.deleteOwnConnector(action.connectorId).pipe(
      switchMap(() => this.globalStateUtils.getDeploymentEnvironmentId()),
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getOwnOrganizationConnectors(deploymentEnvironmentId),
      ),
      takeUntil(
        this.actions$.pipe(
          filter((action) => action instanceof GetOwnOrganizationConnectors),
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
  onShowConnectorDetail(
    ctx: StateContext<ParticipantOwnConnectorListPageState>,
  ) {
    ctx.patchState({showDetail: true});
  }

  @Action(CloseConnectorDetail)
  onCloseConnectorDetail(
    ctx: StateContext<ParticipantOwnConnectorListPageState>,
  ) {
    ctx.patchState({showDetail: false});
  }
}
