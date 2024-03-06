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

import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';
import {E2eDevUser} from 'src/app/common/components/dev-utils/e2e-dev-user-switcher/e2e-dev-user';

const tag = 'GlobalState';

export class RefreshUserInfo {
  static readonly type = `[${tag}] Load User`;
}

export class SwitchE2eDevUser {
  static readonly type = `[${tag}] Set Local Backend Basic Auth`;

  constructor(public readonly user: E2eDevUser) {}
}

export class RefreshDeploymentEnvironments {
  static readonly type = `[${tag}] Refresh Deployment Environments`;
}

export class SwitchEnvironment {
  static readonly type = `[${tag}] Switch Environment`;

  constructor(public readonly selectedEnvironment: DeploymentEnvironmentDto) {}
}
