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
import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {OrganizationCreateFormModel} from '../../../../shared/business/organization-create-form/organization-create-form-model';
import {UserOnboardFormModel} from '../../../../shared/business/user-onboard-form/user-onboard-form-model';

export interface OnboardingUserTabFormModel extends UserOnboardFormModel {
  acceptedTos: FormControl<boolean>;
}

export type OnboardingUserTabFormValue =
  ɵFormGroupRawValue<OnboardingUserTabFormModel>;

export interface OnboardingOrganizationTabFormModel
  extends OrganizationCreateFormModel {
  acceptedTos: FormControl<boolean>;
}

export type OnboardingOrganizationTabFormValue =
  ɵFormGroupRawValue<OnboardingOrganizationTabFormModel>;

export interface OnboardingWizardFormModel {
  userTab: FormGroup<OnboardingUserTabFormModel>;
  organizationTab: FormGroup<OnboardingOrganizationTabFormModel>;
}

export type OnboardingWizardFormValue =
  ɵFormGroupRawValue<OnboardingWizardFormModel>;
