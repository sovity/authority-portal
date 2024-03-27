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
import {
  DEFAULT_ORGANIZATION_CREATE_FORM_MODEL,
  OrganizationCreateFormModel,
} from '../../../../shared/components/business/organization-create-form/organization-create-form-model';
import {
  DEFAULT_USER_CREATE_FORM_MODEL,
  UserCreateFormModel,
} from '../../../../shared/components/business/user-create-form/user-create-form-model';

export interface RegistrationUserTabFormModel extends UserCreateFormModel {}

export type RegistrationUserTabFormValue =
  ɵFormGroupRawValue<RegistrationUserTabFormModel>;

export interface RegistrationOrganizationTabFormModel
  extends OrganizationCreateFormModel {
  acceptedTos: FormControl<boolean>;
}

export type RegistrationOrganizationTabFormValue =
  ɵFormGroupRawValue<RegistrationOrganizationTabFormModel>;

export interface RegistrationWizardFormModel {
  userTab: FormGroup<RegistrationUserTabFormModel>;
  organizationTab: FormGroup<RegistrationOrganizationTabFormModel>;
}

export type RegistrationWizardFormValue =
  ɵFormGroupRawValue<RegistrationWizardFormModel>;

export const DEFAULT_REGISTRATION_WIZARD_FORM_VALUE: RegistrationWizardFormValue =
  {
    userTab: DEFAULT_USER_CREATE_FORM_MODEL,
    organizationTab: {
      ...DEFAULT_ORGANIZATION_CREATE_FORM_MODEL,
      acceptedTos: false,
    },
  };
