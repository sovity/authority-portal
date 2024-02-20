import {Inject, Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {
  DeploymentEnvironmentDto,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {E2E_DEV_USERS} from 'src/app/common/components/dev-utils/e2e-dev-user-switcher/e2e-dev-users';
import {ApiService} from '../api/api.service';
import {isEqualSets} from '../api/fake-backend/utils/set-utils';
import {APP_CONFIG, AppConfig} from '../config/app-config';
import {Fetched} from '../utils/fetched';
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

@State<GlobalState>({
  name: 'GlobalState',
  defaults: INITIAL_GLOBAL_STATE_MODEL,
})
@Injectable()
export class GlobalStateImpl implements NgxsOnInit {
  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private ngZone: NgZone,
    private apiService: ApiService,
    private routeConfigService: RouteConfigService,
  ) {}

  ngxsOnInit(ctx: StateContext<any>): void {
    if (this.config.useLocalBackend) {
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
        organizationMdsId: 'error',
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
