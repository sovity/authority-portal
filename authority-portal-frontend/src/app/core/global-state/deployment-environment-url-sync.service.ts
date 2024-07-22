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
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, combineLatest, takeUntil} from 'rxjs';
import {take} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {DeploymentEnvironmentDto} from '../../../../../authority-portal-backend/authority-portal-api-client-ts';
import {SwitchEnvironment} from './global-state-actions';
import {GlobalStateUtils} from './global-state-utils';

@Injectable({providedIn: 'root'})
export class DeploymentEnvironmentUrlSyncService {
  private readonly environmentIdQueryParam = 'environmentId';

  constructor(
    private store: Store,
    private router: Router,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  updateFromUrlOnce(route: ActivatedRoute, until$: Observable<unknown>) {
    const environmentId: string | undefined =
      route.snapshot.queryParams[this.environmentIdQueryParam];
    if (!environmentId) {
      return;
    }

    this.withAvailableEnvironments((available, current) => {
      if (current.environmentId === environmentId) {
        return;
      }

      const desiredEnvironment = available.find(
        (it) => it.environmentId === environmentId,
      );

      if (desiredEnvironment) {
        this.store.dispatch(new SwitchEnvironment(desiredEnvironment));
      }
    }, until$);
  }

  syncToUrl(activatedRoute: ActivatedRoute, until$: Observable<unknown>) {
    let queryParamEnvironmentId: string | undefined;

    activatedRoute.queryParams
      .pipe(takeUntil(until$))
      .subscribe(
        (params) =>
          (queryParamEnvironmentId = params[this.environmentIdQueryParam]),
      );

    this.globalStateUtils.deploymentEnvironment$
      .pipe(takeUntil(until$))
      .subscribe((environment) => {
        if (environment.environmentId === queryParamEnvironmentId) {
          return;
        }

        this.router.navigate([], {
          queryParams: {
            [this.environmentIdQueryParam]: environment.environmentId,
          },
          queryParamsHandling: 'merge',
        });
      });
  }

  private withAvailableEnvironments(
    fn: (
      available: DeploymentEnvironmentDto[],
      current: DeploymentEnvironmentDto,
    ) => void,
    until$: Observable<unknown>,
  ) {
    combineLatest([
      this.globalStateUtils.getDeploymentEnvironments(),
      this.globalStateUtils.deploymentEnvironment$,
    ])
      .pipe(takeUntil(until$), take(1))
      .subscribe(([deploymentEnvironments, selectedEnvironment]) => {
        fn(deploymentEnvironments, selectedEnvironment);
      });
  }
}
