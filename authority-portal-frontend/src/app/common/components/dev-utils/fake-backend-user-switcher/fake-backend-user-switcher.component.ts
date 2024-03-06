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

import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {TEST_USERS} from 'src/app/core/api/fake-backend/impl/fake-users';
import {updateLoggedInUser} from '../../../../core/api/fake-backend/impl/fake-users';
import {RefreshUserInfo} from '../../../../core/global-state/global-state-actions';
import {GlobalStateUtils} from '../../../../core/global-state/global-state-utils';

@Component({
  selector: 'app-fake-backend-user-switcher',
  templateUrl: './fake-backend-user-switcher.component.html',
})
export class FakeBackendUserSwitcherComponent implements OnInit, OnDestroy {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.items-stretch')
  @HostBinding('class.rounded-lg')
  @HostBinding('class.bg-white')
  @HostBinding('class.shadow-lg')
  @HostBinding('class.text-xs')
  @HostBinding('class.text-center')
  @HostBinding('class.fixed')
  @HostBinding('class.bottom-0')
  @HostBinding('class.right-0')
  @HostBinding('class.m-1')
  @HostBinding('class.px-2')
  @HostBinding('class.py-1.5')
  @HostBinding('class.gap-1')
  @HostBinding('class.z-50')
  @HostBinding('class.w-40')
  cls = true;
  users: UserInfo[] = Object.values(TEST_USERS);
  switcherMinimized = true;
  activeUser: UserInfo | null = null;

  constructor(
    private store: Store,
    private router: Router,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((it) => {
        this.activeUser = it;
      });
  }

  onUserClick(user: UserInfo) {
    if (this.switcherMinimized) {
      this.switcherMinimized = false;
      return;
    }

    this.switcherMinimized = true;
    this.activeUser = user;
    updateLoggedInUser(() => user);
    this.store.dispatch(RefreshUserInfo);
    this.router.navigate(['dashboard']);
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
