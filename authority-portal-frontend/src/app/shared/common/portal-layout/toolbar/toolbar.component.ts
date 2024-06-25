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
import {Component, Inject} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {getHighestRoleString} from 'src/app/core/utils/user-role-utils';
import {ControlCenterModel} from '../control-center/control-center.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  userInfo: UserInfo | null = null;
  userAvatarData!: ControlCenterModel;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.startListeningToUserInfo();
  }

  startListeningToUserInfo() {
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo) => {
        this.userInfo = userInfo;
        this.userAvatarData = {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          roleString: getHighestRoleString(userInfo.roles),
        };
      });
  }

  ngOnDestroy$ = new Subject();
  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
