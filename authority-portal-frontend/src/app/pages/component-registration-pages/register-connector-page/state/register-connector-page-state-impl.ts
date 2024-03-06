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
import {ignoreElements, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {CreateConnectorResponse} from '@sovity.de/authority-portal-client';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../../core/api/api.service';
import {buildConnectorConfig} from '../../../../core/utils/connector-config-utils';
import {Reset, Submit} from './register-connector-page-actions';
import {
  DEFAULT_REGISTER_CONNECTOR_PAGE_STATE,
  RegisterConnectorPageState,
} from './register-connector-page-state';

@State<RegisterConnectorPageState>({
  name: 'RegisterConnectorPage',
  defaults: DEFAULT_REGISTER_CONNECTOR_PAGE_STATE,
})
@Injectable()
export class RegisterConnectorPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<RegisterConnectorPageState>): void {
    ctx.setState(DEFAULT_REGISTER_CONNECTOR_PAGE_STATE);
  }

  @Action(Submit, {cancelUncompleted: true})
  onSubmit(
    ctx: StateContext<RegisterConnectorPageState>,
    action: Submit,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();

    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap(
        (deploymentEnvironmentId): Observable<CreateConnectorResponse> =>
          this.apiService.createOwnConnector(
            action.request,
            deploymentEnvironmentId,
          ),
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
              `Connector ${action.request.name} was successfully registered`,
            );
            ctx.patchState({state: 'success'});
            action.success();
            break;
          case 'WARNING':
            this.toast.showWarning(
              res?.message ||
                'A problem occurred while registering the connector.',
            );
            ctx.patchState({state: 'success'});
            action.success();
            break;
          case 'ERROR':
            this.toast.showDanger(
              res?.message || 'Failed registering connector',
            );
            ctx.patchState({state: 'error'});
            action.enableForm();
            break;
        }
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Failed registering connector', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }
}
