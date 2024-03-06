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
import {Store} from '@ngxs/store';
import {
  AuthorityPortalClient,
  buildAuthorityPortalClient,
} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from '../config/app-config';
import {GlobalState} from '../global-state/global-state';
import {GlobalStateImpl} from '../global-state/global-state-impl';
import {AUTHORITY_PORTAL_FAKE_BACKEND} from './fake-backend/fake-backend';

@Injectable()
export class ApiClientFactory {
  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private store: Store,
  ) {}

  newAuthorityPortalClient(): AuthorityPortalClient {
    return buildAuthorityPortalClient({
      backendUrl: this.config.backendUrl,
      configOverrides: {
        // Required for Local Dev with Fake Backend
        fetchApi: this.config.useFakeBackend
          ? AUTHORITY_PORTAL_FAKE_BACKEND
          : undefined,

        // Required for Local E2E Dev with Quarkus Backend
        headers: this.buildHeaders(),
      },
    });
  }

  private buildHeaders(): Record<string, string> {
    const globalState = this.store.selectSnapshot<GlobalState>(GlobalStateImpl);
    if (!globalState.e2eDevUser) {
      return {};
    }

    // Local Dev Only: Add Basic Auth Header
    const credentials = [
      globalState.e2eDevUser!.user,
      globalState.e2eDevUser!.password,
    ].join(':');

    return {
      Authorization: `Basic ${btoa(credentials)}`,
    };
  }
}
