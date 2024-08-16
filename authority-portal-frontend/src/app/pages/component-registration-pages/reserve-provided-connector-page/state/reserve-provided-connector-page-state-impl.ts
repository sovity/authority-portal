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
import {ignoreElements, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {
  CreateConnectorRequest,
  CreateConnectorResponse,
  CreateConnectorWithJwksRequest,
  IdResponse,
  OrganizationOverviewEntryDto,
  ReserveConnectorRequest,
} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ErrorService} from 'src/app/core/services/error.service';
import {buildConnectorConfig} from 'src/app/core/utils/connector-config-utils';
import {Fetched} from 'src/app/core/utils/fetched';
import {ToastService} from 'src/app/shared/common/toast-notifications/toast.service';
import {ReserveProvidedConnectorPageFormValue} from '../reserve-provided-connector-page/reserve-provided-connector-page-form-model';
import {
  GetOrganizations,
  Reset,
  Submit,
} from './reserve-provided-connector-page-actions';
import {
  DEFAULT_RESERVE_PROVIDED_CONNECTOR_PAGE_STATE,
  ReserveProvidedConnectorPageState,
} from './reserve-provided-connector-page-state';

@State<ReserveProvidedConnectorPageState>({
  name: 'ReserveProvidedConnectorPage',
  defaults: DEFAULT_RESERVE_PROVIDED_CONNECTOR_PAGE_STATE,
})
@Injectable()
export class ReserveProvidedConnectorPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<ReserveProvidedConnectorPageState>): void {
    ctx.setState(DEFAULT_RESERVE_PROVIDED_CONNECTOR_PAGE_STATE);
  }

  @Action(Submit, {cancelUncompleted: true})
  onSubmit(
    ctx: StateContext<ReserveProvidedConnectorPageState>,
    action: Submit,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();

    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap(
        (deploymentEnvironmentId): Observable<CreateConnectorResponse> => {
          const request = this.buildReserveConnectorRequest(action.request);
          return this.apiService.reserveProvidedConnector(
            request,
            deploymentEnvironmentId,
          );
        },
      ),
      tap((res) => {
        ctx.patchState({
          connectorConfig: buildConnectorConfig(
            this.globalStateUtils.snapshot.selectedEnvironment!,
            res,
          ),
        });
        switch (res.status) {
          case 'OK':
            this.toast.showSuccess(
              `Connector ${action.request.connectorInfo.name} was successfully reserved`,
            );
            ctx.patchState({state: 'success'});
            action.success();
            break;
          case 'WARNING':
            this.toast.showWarning(
              res?.message ||
                'A problem occurred while reserving the connector.',
            );
            ctx.patchState({state: 'success'});
            action.success();
            break;
          case 'ERROR':
            this.toast.showDanger(res?.message || 'Failed reserving connector');
            ctx.patchState({state: 'error'});
            action.enableForm();
            break;
        }
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Failed reserving connector', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }

  @Action(GetOrganizations, {cancelUncompleted: true})
  onRefreshOrganizations(
    ctx: StateContext<ReserveProvidedConnectorPageState>,
  ): Observable<never> {
    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getOrganizationsForProvidingConnectors(
          deploymentEnvironmentId,
        ),
      ),
      map((result) => result.organizations),
      Fetched.wrap({failureMessage: 'Failed loading organizations'}),
      tap((organizations) => this.organizationsRefreshed(ctx, organizations)),
      ignoreElements(),
    );
  }

  private organizationsRefreshed(
    ctx: StateContext<ReserveProvidedConnectorPageState>,
    newOrganizations: Fetched<OrganizationOverviewEntryDto[]>,
  ) {
    ctx.patchState({organizationList: newOrganizations});
  }

  private buildReserveConnectorRequest(
    formValue: ReserveProvidedConnectorPageFormValue,
  ): ReserveConnectorRequest {
    return {
      name: formValue.connectorInfo.name,
      location: formValue.connectorInfo.location,
      customerOrganizationId: formValue.connectorInfo.organization!.id,
    };
  }
}
