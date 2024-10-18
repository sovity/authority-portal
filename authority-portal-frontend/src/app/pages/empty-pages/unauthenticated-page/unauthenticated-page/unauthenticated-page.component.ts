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
import {Title} from '@angular/platform-browser';
import {Store} from '@ngxs/store';
import {
  ALL_USERS,
  fakeLogin,
} from 'src/app/core/api/fake-backend/impl/fake-users';
import {RefreshUserInfo} from 'src/app/core/global-state/global-state-actions';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';

@Component({
  selector: 'app-unauthenticated-page',
  templateUrl: './unauthenticated-page.component.html',
})
export class UnauthenticatedPageComponent {
  fakeBackendUserIds = Object.keys(ALL_USERS);
  fakeBackendUsers = ALL_USERS;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    public store: Store,
    private titleService: Title,
  ) {
    this.titleService.setTitle('Unauthenticated');
  }

  get loginUrl(): string {
    const url = new URL(this.appConfig.loginUrl);
    url.searchParams.set('redirect_uri', location.href);
    return url.toString();
  }

  login(event: any): void {
    if (this.appConfig.useFakeBackend) {
      fakeLogin(event.target.value);
    } else {
      location.href = this.loginUrl;
    }
  }
}
