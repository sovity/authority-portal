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
import {Observable, takeUntil} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {UserDetailDto, UserRoleDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {BreadcrumbService} from '../../../common/layouts/portal-layout/breadcrumb/breadcrumb.service';
import {ApiService} from '../../../core/api/api.service';
import {CustomRxjsOperators} from '../../../core/custom-rxjs-operators';
import {Fetched} from '../../../core/utils/fetched';
import {UserDetailConfig} from '../../../shared/components/business/shared-user-detail/shared-user-detail.model';
import {buildUserRoleUpdateConfigFromUserInfo} from '../../../shared/components/business/shared-user-detail/user-role-update-config';
import {UserDeleteDialogService} from '../../../shared/components/business/user-delete-dialog/user-delete-dialog.service';
import {
  HeaderBarAction,
  HeaderBarConfig,
} from '../../../shared/components/common/header-bar/header-bar.model';
import {Reset} from './control-center-organization-member-detail-page-action';
import {
  ControlCenterOrganizationMemberDetailPageState,
  DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBER_DETAIL_PAGE_STATE,
} from './control-center-organization-member-detail-page-state';

type Ctx = StateContext<ControlCenterOrganizationMemberDetailPageState>;

@State<ControlCenterOrganizationMemberDetailPageState>({
  name: 'ControlCenterOrganizationMemberDetailPageState',
  defaults: DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBER_DETAIL_PAGE_STATE,
})
@Injectable()
export class ControlCenterOrganizationMemberDetailPageStateImpl {
  constructor(
    private apiService: ApiService,
    private globalStateUtils: GlobalStateUtils,
    private breadcrumbService: BreadcrumbService,
    private userDeleteDialogService: UserDeleteDialogService,
    private router: Router,
    private customRxjsOperators: CustomRxjsOperators,
  ) {}

  @Action(Reset, {cancelUncompleted: true})
  onReset(ctx: Ctx, action: Reset): Observable<never> {
    return this.apiService.getUserDetailDto(action.userId).pipe(
      Fetched.wrap({failureMessage: 'Failed to fetch user details'}),
      tap((user) => {
        user.ifReady((userDetails) => {
          if (userDetails.firstName || userDetails.lastName) {
            this.breadcrumbService.addReplacement(
              userDetails.userId,
              `${userDetails.firstName} ${userDetails.lastName}`,
            );
          }
        });
        ctx.patchState({
          user,
          headerBarConfig: user
            .map((data) =>
              this.buildHeaderBarConfig(ctx, data, action.componentLifetime$),
            )
            .orElse(null),
          userDetailConfig: user
            .map((userDetails) =>
              this.buildUserDetailConfig(
                ctx,
                userDetails,
                action.componentLifetime$,
              ),
            )
            .orElse(null),
        });
      }),
      takeUntil(action.componentLifetime$),
      ignoreElements(),
    );
  }

  private buildHeaderBarConfig(
    ctx: Ctx,
    user: UserDetailDto,
    componentLifetime$: Observable<any>,
  ): HeaderBarConfig {
    let headerActions: HeaderBarAction[] = [];

    if (this.globalStateUtils.userId === user.userId) {
      headerActions.push({
        label: 'Edit',
        action: () => this.router.navigate(['/control-center/my-profile/edit']),
        permissions: [UserRoleDto.User],
      });
    } else {
      headerActions.push({
        label: 'Delete user',
        action: () => this.onDeleteUserClick(ctx, componentLifetime$),
        permissions: [UserRoleDto.Admin],
      });

      if (user.registrationStatus === 'ACTIVE') {
        headerActions.push({
          label: 'Deactivate user',
          action: () => this.onDeactivateUserClick(ctx, componentLifetime$),
          permissions: [UserRoleDto.Admin],
        });
      }

      if (user.registrationStatus === 'DEACTIVATED') {
        headerActions.push({
          label: 'Reactivate user',
          action: () => this.onReactivateUserClick(ctx, componentLifetime$),
          permissions: [UserRoleDto.Admin],
        });
      }
    }

    return {
      title: `${user.firstName} ${user.lastName}`,
      subtitle: `Member Of ${user.organizationName}`,
      headerActions,
    };
  }

  private buildUserDetailConfig(
    ctx: Ctx,
    user: UserDetailDto,
    componentLifetime$: Observable<any>,
  ): UserDetailConfig {
    return {
      pageFor: 'INTERNAL_VIEW',
      userId: user.userId,
      user,
      usageType: 'CONTROL_CENTER_PAGE',
      roles: buildUserRoleUpdateConfigFromUserInfo({
        currentUser: this.globalStateUtils.userInfo,
        target: user,
        onRoleUpdateSuccessful: () => this.refresh(ctx, componentLifetime$),
      }),
    };
  }

  private onReactivateUserClick(ctx: Ctx, componentLifetime$: Observable<any>) {
    const user = ctx.getState().user.data;
    this.apiService
      .reactivateUser(user.userId)
      .pipe(
        this.customRxjsOperators.withBusyLock(ctx),
        this.customRxjsOperators.withToastResultHandling('Reactivating user'),
        tap(() => this.refresh(ctx, componentLifetime$)),
        takeUntil(componentLifetime$),
      )
      .subscribe();
  }

  private onDeactivateUserClick(ctx: Ctx, componentLifetime$: Observable<any>) {
    const user = ctx.getState().user.data;
    this.apiService
      .deactivateUser(user.userId)
      .pipe(
        this.customRxjsOperators.withBusyLock(ctx),
        this.customRxjsOperators.withToastResultHandling('Deactivating user'),
        tap(() => this.refresh(ctx, componentLifetime$)),
        takeUntil(componentLifetime$),
      )
      .subscribe();
  }

  private onDeleteUserClick(ctx: Ctx, componentLifetime$: Observable<any>) {
    const state = ctx.getState();
    let user = state.user.data;
    this.userDeleteDialogService.showDeleteUserModal(
      {
        userId: user.userId,
        userFullName: user.firstName + ' ' + user.lastName,
        userOrganizationName: user.organizationName,
        onDeleteSuccess: () => {
          this.router.navigate(['/control-center/my-users']);
        },
      },
      componentLifetime$,
    );
  }

  private refresh(
    ctx: StateContext<ControlCenterOrganizationMemberDetailPageState>,
    componentLifetime$: Observable<any>,
  ) {
    ctx.dispatch(
      new Reset(ctx.getState().user.data.userId, componentLifetime$),
    );
  }
}
