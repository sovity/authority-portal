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
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ignoreElements, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext, ofAction} from '@ngxs/store';
import {CreateConnectorResponse} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ErrorService} from 'src/app/core/services/error.service';
import {ToastService} from 'src/app/shared/common/toast-notifications/toast.service';
import {Reset, Submit} from './request-connector-page-actions';
import {
  DEFAULT_REQUEST_CONNECTOR_STATE,
  RequestConnectorPageState,
} from './request-connector-page-state';

@State<RequestConnectorPageState>({
  name: 'RequestConnectorPage',
  defaults: DEFAULT_REQUEST_CONNECTOR_STATE,
})
@Injectable()
export class RequestConnectorPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
    private router: Router,
  ) {}

  @Action(Reset)
  onReset(ctx: StateContext<RequestConnectorPageState>): void {
    ctx.setState(DEFAULT_REQUEST_CONNECTOR_STATE);
  }

  @Action(Submit, {cancelUncompleted: true})
  onSubmit(
    ctx: StateContext<RequestConnectorPageState>,
    action: Submit,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();

    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap(
        (deploymentEnvironmentId): Observable<CreateConnectorResponse> =>
          this.apiService.createCaas(action.request, deploymentEnvironmentId),
      ),
      tap((res) => {
        switch (res.status) {
          case 'OK':
            this.toast.showSuccess(
              `Connector ${action.request.connectorTitle} requested successfully. You will receive an E-Mail confirming the deployment in the next few minutes.`,
            );
            ctx.patchState({state: 'success'});
            this.router.navigate(['/', 'my-organization', 'connectors']);
            break;
          case 'WARNING':
            this.toast.showWarning(
              res?.message ||
                'A problem occurred while requesting the connector.',
            );
            ctx.patchState({state: 'success'});
            break;
          case 'ERROR':
            this.toast.showDanger(
              res?.message || 'Failed requesting connector',
            );
            ctx.patchState({state: 'error'});
            action.enableForm();
            break;
        }
      }),
      takeUntil(this.actions$.pipe(ofAction(Reset))),
      this.errorService.toastFailureRxjs('Failed requesting connector', () => {
        ctx.patchState({state: 'error'});
        action.enableForm();
      }),
      ignoreElements(),
    );
  }
}
