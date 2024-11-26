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
import {Inject, Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {
  DeploymentEnvironmentDto,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';
import {Fetched} from 'src/app/core/utils/fetched';
import {E2E_DEV_USERS} from '../../shared/dev-utils/e2e-dev-user-switcher/e2e-dev-users';
import {isEqualSets} from '../utils/set-utils';
import {patchState} from '../utils/state-utils';
import {GlobalState, INITIAL_GLOBAL_STATE_MODEL} from './global-state';
import {
  RefreshDeploymentEnvironments,
  RefreshUserInfo,
  SwitchE2eDevUser,
  SwitchEnvironment,
} from './global-state-actions';
import {AuthorityPortalPageSet} from './routes/authority-portal-page-set';
import {RouteConfigService} from './routes/route-config-service';
import {UrlBeforeLoginService} from './routes/url-before-login.service';

@State<GlobalState>({
  name: 'GlobalState',
  defaults: INITIAL_GLOBAL_STATE_MODEL,
})
@Injectable()
export class GlobalStateImpl implements NgxsOnInit {
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private ngZone: NgZone,
    private apiService: ApiService,
    private routeConfigService: RouteConfigService,
    private urlBeforeLoginService: UrlBeforeLoginService,
  ) {}

  ngxsOnInit(ctx: StateContext<any>): void {
    if (this.appConfig.useLocalBackend) {
      ctx.dispatch(new SwitchE2eDevUser(E2E_DEV_USERS[0]));
    }
    ctx.dispatch(RefreshDeploymentEnvironments);
  }

  @Selector()
  static roles(state: GlobalState): Set<UserRoleDto> {
    return state.roles;
  }

  @Action(SwitchE2eDevUser)
  onSwitchE2eDevUser(ctx: StateContext<GlobalState>, action: SwitchE2eDevUser) {
    ctx.patchState({e2eDevUser: action.user});
  }

  @Action(RefreshUserInfo, {cancelUncompleted: true})
  onRefreshUserInfo(ctx: StateContext<GlobalState>): Observable<never> {
    return this.apiService.userProfile().pipe(
      Fetched.wrapAndReplaceErrorsSilently<UserInfo>({
        authenticationStatus: 'UNAUTHENTICATED',
        roles: ['UNAUTHENTICATED'],
        userId: 'error',
        firstName: 'Authentication',
        lastName: 'Failure',
        registrationStatus: undefined,
        organizationId: 'error',
        organizationName: 'Authentication Failure',
      }),
      tap((userInfo) => this.onUserInfoRefreshed(ctx, userInfo)),
      ignoreElements(),
    );
  }

  @Action(RefreshDeploymentEnvironments, {cancelUncompleted: true})
  onRefreshDeploymentEnvironments(
    ctx: StateContext<GlobalState>,
  ): Observable<never> {
    return this.apiService.getDeploymentEnvironments().pipe(
      Fetched.wrap({failureMessage: 'Failed loading deployment environments'}),
      tap((deploymentEnvironment) =>
        this.deploymentEnvironmentRefreshed(ctx, deploymentEnvironment),
      ),
      ignoreElements(),
    );
  }

  @Action(SwitchEnvironment)
  onSwitchEnvironment(
    ctx: StateContext<GlobalState>,
    action: SwitchEnvironment,
  ) {
    ctx.patchState({selectedEnvironment: action.selectedEnvironment});
  }

  private onUserInfoRefreshed(
    ctx: StateContext<GlobalState>,
    newUserInfo: Fetched<UserInfo>,
  ) {
    patchState(ctx, (state) => {
      let userInfo = state.userInfo.mergeIfReady(newUserInfo);

      // Update Routes in when user status has changed
      let pageSet: AuthorityPortalPageSet =
        this.routeConfigService.decidePageSet(userInfo);

      this.ngZone.run(() =>
        this.routeConfigService.switchRouteConfig(state.pageSet, pageSet),
      );

      // Update Roles
      let roles = new Set(userInfo.map((it) => it.roles).orElse([]));
      roles = isEqualSets(state.roles, roles) ? state.roles : roles;

      this.urlBeforeLoginService.clearOriginalUrl();

      return {userInfo, pageSet, roles};
    });
  }

  private deploymentEnvironmentRefreshed(
    ctx: StateContext<GlobalState>,
    deploymentEnvironments: Fetched<DeploymentEnvironmentDto[]>,
  ) {
    let selectedEnvironment = ctx.getState().selectedEnvironment;
    ctx.patchState({
      deploymentEnvironments,
      selectedEnvironment:
        selectedEnvironment == null &&
        deploymentEnvironments.dataOrUndefined?.length
          ? deploymentEnvironments.dataOrUndefined[0]
          : selectedEnvironment,
    });
  }
}
