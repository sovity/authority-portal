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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {UserDetailConfig} from 'src/app/shared/components/business/shared-user-detail/shared-user-detail.model';
import {buildUserRoleUpdateConfigFromUserInfo} from '../../../../shared/components/business/shared-user-detail/user-role-update-config';
import {UserDetailPageConfig} from '../../authority-organization-detail-page/authority-organization-detail-page.model';
import {
  RefreshOrganizationUser,
  SetOrganizationUserId,
} from '../../state/authority-organization-detail-page-actions';
import {
  AuthorityOrganizationUserDetailState,
  DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_STATE,
} from '../../state/authority-organization-detail-page-state';
import {AuthorityOrganizationDetailPageStateImpl} from '../../state/authority-organization-detail-page-state-impl';

@Component({
  selector: 'app-organization-user-detail',
  templateUrl: './organization-user-detail.component.html',
})
export class OrganizationUserDetailComponent implements OnInit, OnDestroy {
  @Input() userDetailPageConfig!: UserDetailPageConfig;

  userDetailConfig!: UserDetailConfig;
  state = DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_STATE;
  ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit(): void {
    this.setOrganizationUserId(
      this.userDetailPageConfig.mdsId,
      this.userDetailPageConfig.userId,
    );
    this.refresh();
    this.startListeningToState();
  }

  startListeningToState() {
    this.store
      .select<AuthorityOrganizationUserDetailState>(
        AuthorityOrganizationDetailPageStateImpl.openedUserDetailState,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        if (state.user.isReady)
          this.userDetailConfig = {
            userId: state.userId,
            user: state.user.data,
            pageFor: 'AUTHORITY_VIEW',
            usageType: 'DETAIL_PAGE',
            roles: buildUserRoleUpdateConfigFromUserInfo({
              currentUser: this.globalStateUtils.userInfo,
              target: state.user.data,
              onRoleUpdateSuccessful: () => {
                this.store.dispatch(new RefreshOrganizationUser());
              },
            }),
          };
      });
  }

  setOrganizationUserId(mdsId: string, userId: string) {
    this.store.dispatch(new SetOrganizationUserId(mdsId, userId));
  }

  refresh() {
    this.store.dispatch(RefreshOrganizationUser);
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
