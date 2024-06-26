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
import {
  DeploymentEnvironmentDto,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';
import {E2eDevUser} from '../../shared/dev-utils/e2e-dev-user-switcher/e2e-dev-user';
import {AuthorityPortalPageSet} from './routes/authority-portal-page-set';

export interface GlobalState {
  pageSet: AuthorityPortalPageSet;
  userInfo: Fetched<UserInfo>;
  roles: Set<UserRoleDto>;

  e2eDevUser: E2eDevUser | null;
  deploymentEnvironments: Fetched<DeploymentEnvironmentDto[]>;
  selectedEnvironment: DeploymentEnvironmentDto | null;
}

export const INITIAL_GLOBAL_STATE_MODEL: GlobalState = {
  pageSet: 'LOADING',
  userInfo: Fetched.empty(),
  roles: new Set(),
  e2eDevUser: null,
  deploymentEnvironments: Fetched.empty(),
  selectedEnvironment: null,
};
