import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, switchMap, take, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {UserDetailDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {UserDetailConfig} from '../../../shared/components/business/shared-user-detail/shared-user-detail.model';
import {buildUserRoleUpdateConfigUneditable} from '../../../shared/components/business/shared-user-detail/user-role-update-config';
import {HeaderBarConfig} from '../../../shared/components/common/header-bar/header-bar.model';
import {Reset} from './control-center-user-profile-page-action';
import {
  ControlCenterUserProfilePageState,
  DEFAULT_CONTROL_CENTER_USER_PROFILE_PAGE_STATE,
} from './control-center-user-profile-page-state';

type Ctx = StateContext<ControlCenterUserProfilePageState>;

@State<ControlCenterUserProfilePageState>({
  name: 'ControlCenterUserProfilePageState',
  defaults: DEFAULT_CONTROL_CENTER_USER_PROFILE_PAGE_STATE,
})
@Injectable()
export class ControlCenterUserProfilePageStateImpl {
  constructor(
    private apiService: ApiService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(Reset)
  onReset(ctx: Ctx): Observable<never> {
    return this.globalStateUtils.userInfo$.pipe(
      take(1),
      switchMap((userInfo) =>
        this.apiService.getUserDetailDto(userInfo.userId),
      ),
      Fetched.wrap({failureMessage: 'Failed to fetch user details'}),
      tap((user) => {
        ctx.patchState({
          user,
          headerBarConfig: user
            .map((userDetails) => this.buildHeaderBarConfig(userDetails))
            .orElse(null),
          userDetailConfig: user
            .map((userDetails) => this.buildUserDetailConfig(userDetails))
            .orElse(null),
        });
      }),
      ignoreElements(),
    );
  }

  private buildHeaderBarConfig(user: UserDetailDto): HeaderBarConfig {
    return {
      title: `${user.firstName}  ${user.lastName}`,
      subtitle: 'Details about your profile',
      headerActions: [],
    };
  }

  private buildUserDetailConfig(user: UserDetailDto): UserDetailConfig {
    return {
      pageFor: 'OWN',
      userId: user.userId,
      user,
      usageType: 'CONTROL_CENTER_PAGE',
      roles: buildUserRoleUpdateConfigUneditable(user.roles),
    };
  }
}
