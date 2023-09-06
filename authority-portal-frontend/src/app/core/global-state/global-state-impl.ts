import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {UserInfo, UserInfoRolesEnum} from '@sovity.de/authority-portal-client';
import {ApiService} from '../api/api.service';
import {isEqualSets} from '../api/fake-backend/utils/set-utils';
import {Fetched} from '../utils/fetched';
import {patchState} from '../utils/state-utils';
import {GlobalState, INITIAL_GLOBAL_STATE_MODEL} from './global-state';
import {RefreshUserInfo} from './global-state-actions';
import {AuthorityPortalPageSet} from './routes/authority-portal-page-set';
import {RouteConfigService} from './routes/route-config-service';

@State<GlobalState>({
  name: 'GlobalState',
  defaults: INITIAL_GLOBAL_STATE_MODEL,
})
@Injectable()
export class GlobalStateImpl {
  constructor(
    private ngZone: NgZone,
    private apiService: ApiService,
    private routeConfigService: RouteConfigService,
  ) {}

  @Selector()
  static roles(state: GlobalState): Set<UserInfoRolesEnum> {
    return state.roles;
  }

  @Action(RefreshUserInfo, {cancelUncompleted: true})
  onRefreshUserInfo(ctx: StateContext<GlobalState>): Observable<never> {
    return this.apiService.userProfile().pipe(
      Fetched.wrap({failureMessage: 'Failed checking session status'}),
      tap((userInfo) => this.onUserInfoRefreshed(ctx, userInfo)),
      ignoreElements(),
    );
  }

  private onUserInfoRefreshed(
    ctx: StateContext<GlobalState>,
    newUserInfo: Fetched<UserInfo>,
  ) {
    patchState(ctx, (state) => {
      let userInfo = state.userInfo.mergeIfReady(newUserInfo);

      // Update Routes in when user status has changed
      let pageSet: AuthorityPortalPageSet = userInfo
        .map((it) => it.registrationStatus)
        .ifReadyElse(
          (it) =>
            it === 'APPROVED' ? 'AUTHORITY_PORTAL' : 'REGISTRATION_PROCESS',
          'LOADING',
        );

      this.ngZone.run(() =>
        this.routeConfigService.switchRouteConfig(state.pageSet, pageSet),
      );

      // Update Roles
      let roles = new Set(userInfo.map((it) => it.roles).orElse([]));
      roles = isEqualSets(state.roles, roles) ? state.roles : roles;

      return {userInfo, pageSet, roles};
    });
  }
}
