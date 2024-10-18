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
import {Component, Inject, Input, OnChanges} from '@angular/core';
import {fakeLogout} from 'src/app/core/api/fake-backend/impl/fake-users';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';
import {AvatarConfig} from '../avatar/avatar.component';
import {ControlCenterModel} from './control-center.model';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
})
export class ControlCenterComponent implements OnChanges {
  @Input() userData!: ControlCenterModel;
  @Input() logoutUrl!: string;

  userAvatar!: AvatarConfig;
  userMenuOpen = false;

  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}

  ngOnChanges(): void {
    this.userAvatar = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
    };
  }

  logout(): void {
    if (this.appConfig.useFakeBackend) {
      fakeLogout();
    } else {
      location.href = this.logoutUrl;
    }
  }
}
