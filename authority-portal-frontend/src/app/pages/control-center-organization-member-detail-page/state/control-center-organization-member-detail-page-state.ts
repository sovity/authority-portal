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
import {Fetched} from 'src/app/core/utils/fetched';
import {UserDetailConfig} from '../../../shared/business/shared-user-detail/shared-user-detail.model';
import {HeaderBarConfig} from '../../../shared/common/header-bar/header-bar.model';

export interface ControlCenterOrganizationMemberDetailPageState {
  user: Fetched<UserDetailDto>;
  userDetailConfig: UserDetailConfig | null;
  headerBarConfig: HeaderBarConfig | null;
  busy: boolean;
}

export const DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBER_DETAIL_PAGE_STATE: ControlCenterOrganizationMemberDetailPageState =
  {
    user: Fetched.empty(),
    userDetailConfig: null,
    headerBarConfig: null,
    busy: false,
  };
