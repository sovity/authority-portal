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
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {Action, Actions, State, StateContext} from '@ngxs/store';
import {CentralComponentDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  DeleteCentralComponent,
  RefreshCentralComponents,
} from './central-component-list-page-actions';
import {
  CentralComponentListPageState,
  DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE,
} from './central-component-list-page-state';

@State<CentralComponentListPageState>({
  name: 'CentralComponentListPageState',
  defaults: DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE,
})
@Injectable()
export class CentralComponentListPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private toast: ToastService,
    private errorService: ErrorService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(RefreshCentralComponents)
  onRefreshCentralComponents(
    ctx: StateContext<CentralComponentListPageState>,
  ): Observable<never> {
    return this.fetchCentralComponents().pipe(
      Fetched.wrap({failureMessage: 'Failed loading central components'}),
      tap((centralComponents) =>
        ctx.patchState({centralComponents: centralComponents}),
      ),
      ignoreElements(),
    );
  }
  @Action(DeleteCentralComponent)
  onShowDeleteCentralComponentModal(
    ctx: StateContext<CentralComponentListPageState>,
    action: DeleteCentralComponent,
  ): Observable<any> {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    let centralComponent = action.centralComponent;
    ctx.patchState({
      busyDeletingComponentId: centralComponent.centralComponentId,
    });
    ctx.patchState({
      busy: true,
      busyDeletingComponentId: centralComponent.centralComponentId,
    });

    return this.apiService
      .deleteCentralComponent(centralComponent.centralComponentId)
      .pipe(
        switchMap(() => this.fetchCentralComponents()),
        takeUntil(
          this.actions$.pipe(
            filter((action) => action instanceof RefreshCentralComponents),
          ),
        ),
        this.errorService.toastFailureRxjs("Central Component wasn't deleted"),
        tap((data) => {
          ctx.patchState({centralComponents: Fetched.ready(data)});
          this.toast.showSuccess(
            `Central Component ${centralComponent.name} was successfully deleted`,
          );
        }),
        finalize(() =>
          ctx.patchState({busy: false, busyDeletingComponentId: null}),
        ),
        ignoreElements(),
      );
  }

  private fetchCentralComponents(): Observable<CentralComponentDto[]> {
    return this.globalStateUtils
      .getDeploymentEnvironmentId()
      .pipe(
        switchMap((deploymentEnvironmentId) =>
          this.apiService.getCentralComponents(deploymentEnvironmentId),
        ),
      );
  }
}
