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
import {Fetched} from '../../../core/utils/fetched';
import {UserDetailConfig} from '../../../shared/components/business/shared-user-detail/shared-user-detail.model';
import {HeaderBarConfig} from '../../../shared/components/common/header-bar/header-bar.model';

export interface ControlCenterUserProfilePageState {
  user: Fetched<UserDetailDto>;
  userDetailConfig: UserDetailConfig | null;
  headerBarConfig: HeaderBarConfig | null;
  busy: boolean;
}

export const DEFAULT_CONTROL_CENTER_USER_PROFILE_PAGE_STATE: ControlCenterUserProfilePageState =
  {
    user: Fetched.empty(),
    userDetailConfig: null,
    headerBarConfig: null,
    busy: false,
  };
