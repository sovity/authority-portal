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
import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ignoreElements, switchMap, take, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {UserDetailDto, UserRoleDto} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';
import {Fetched} from 'src/app/core/utils/fetched';
import {UserDeleteDialogService} from 'src/app/shared/business/user-delete-dialog/user-delete-dialog.service';
import {UserDetailConfig} from '../../../shared/business/shared-user-detail/shared-user-detail.model';
import {buildUserRoleUpdateConfigUneditable} from '../../../shared/business/shared-user-detail/user-role-update-config';
import {HeaderBarConfig} from '../../../shared/common/header-bar/header-bar.model';
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
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private router: Router,
    private apiService: ApiService,
    private globalStateUtils: GlobalStateUtils,
    private userDeleteDialogService: UserDeleteDialogService,
  ) {}

  @Action(Reset)
  onReset(ctx: Ctx, action: Reset): Observable<never> {
    return this.globalStateUtils.userInfo$.pipe(
      switchMap((userInfo) =>
        this.apiService.getUserDetailDto(userInfo.userId),
      ),
      Fetched.wrap({failureMessage: 'Failed to fetch user details'}),
      tap((user) => {
        ctx.patchState({
          user,
          headerBarConfig: user
            .map((userDetails) =>
              this.buildHeaderBarConfig(userDetails, action.componentLifetime$),
            )
            .orElse(null),
          userDetailConfig: user
            .map((userDetails) => this.buildUserDetailConfig(userDetails))
            .orElse(null),
        });
      }),
      ignoreElements(),
    );
  }

  private buildHeaderBarConfig(
    user: UserDetailDto,
    componentLifetime$: Observable<any>,
  ): HeaderBarConfig {
    return {
      title: `${user.firstName} ${user.lastName}`,
      subtitle: 'Your User Profile',
      headerActions: [
        {
          label: 'Edit',
          action: () =>
            this.router.navigate(['/control-center/my-profile/edit']),
          permissions: [UserRoleDto.User],
        },
        {
          label: 'Delete',
          action: () => {
            this.userDeleteDialogService.showDeleteUserModal(
              {
                userId: user.userId,
                userFullName: user.firstName + ' ' + user.lastName,
                userOrganizationName: user.organizationName,
                onDeleteSuccess: () =>
                  (window.location.href = this.appConfig.logoutUrl),
              },
              componentLifetime$,
            );
          },
          permissions: [UserRoleDto.User],
        },
      ],
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
