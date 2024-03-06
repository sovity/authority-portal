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

import {UserRoleDto} from '@sovity.de/authority-portal-client';

export interface HeaderBarConfig {
  title: string;
  subtitle: string;
  headerActions: HeaderBarAction[];
}

export interface HeaderBarAction {
  label: string;
  icon?: string;
  action: () => void;
  permissions: UserRoleDto[];
}
