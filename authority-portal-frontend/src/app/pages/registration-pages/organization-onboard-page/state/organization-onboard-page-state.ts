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
  OwnOrganizationDetailsDto,
  UserDetailDto,
} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface OrganizationOnboardPageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
  details: Fetched<{
    user: UserDetailDto;
    organization: OwnOrganizationDetailsDto;
  }>;
  onboardingType: 'USER_ONBOARDING' | 'USER_ORGANIZATION_ONBOARDING';
}

export const DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE: OrganizationOnboardPageState =
  {
    state: 'editing',
    details: Fetched.empty(),
    onboardingType: 'USER_ONBOARDING',
  };
