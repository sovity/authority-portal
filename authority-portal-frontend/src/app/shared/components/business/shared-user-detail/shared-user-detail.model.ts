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
import {UserDetailDto} from '@sovity.de/authority-portal-client';
import {UserRoleUpdateConfig} from './user-role-update-config';

export interface UserDetailConfig {
  userId: string;
  user: UserDetailDto;
  pageFor: 'AUTHORITY_VIEW' | 'INTERNAL_VIEW' | 'OWN';
  usageType: 'DETAIL_PAGE' | 'CONTROL_CENTER_PAGE';
  roles: UserRoleUpdateConfig;
}
