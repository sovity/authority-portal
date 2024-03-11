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
  OnboardingOrganizationUpdateDto,
  OnboardingUserUpdateDto,
} from '@sovity.de/authority-portal-client';

const tag = 'OnboardingPage';

export interface OnboardingProcessRequest {
  userProfile: OnboardingUserUpdateDto;
  organizationProfile: OnboardingOrganizationUpdateDto;
}

export class OnboardingProcessFormSubmit {
  static readonly type = `[${tag}] Onboarding Form Submit`;
  constructor(
    public request: OnboardingProcessRequest,
    public enableForm: () => void,
    public disableForm: () => void,
    public success: () => void,
  ) {}
}

export class Reset {
  static readonly type = `[${tag}] Reset`;
}
