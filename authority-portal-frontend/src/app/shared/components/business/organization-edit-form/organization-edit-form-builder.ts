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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {phoneNumberValidator} from '../../../../core/utils/validators/phone-number-validator';
import {urlValidator} from '../../../../core/utils/validators/url-validator';
import {
  OrganizationEditFormModel,
  OrganizationEditFormValue,
} from './organization-edit-form-model';

export const buildOrganizationEditForm = (
  formBuilder: FormBuilder,
  initialOrganization: OrganizationEditFormValue,
): FormGroup<OrganizationEditFormModel> => {
  return formBuilder.nonNullable.group({
    website: [
      initialOrganization.website,
      [Validators.required, Validators.maxLength(128), urlValidator],
    ],
    businessUnit: [
      initialOrganization.businessUnit,
      [Validators.required, Validators.maxLength(128)],
    ],
    industry: [initialOrganization.industry, [Validators.required]],
    description: [
      initialOrganization.description,
      [Validators.required, Validators.maxLength(4096)],
    ],
    mainAddress: [
      initialOrganization.mainAddress,
      [Validators.required, Validators.maxLength(128)],
    ],
    billingAddressSameAsMain: [
      initialOrganization.billingAddressSameAsMain,
      [Validators.required],
    ],
    billingAddress: [
      initialOrganization.billingAddress,
      [Validators.required, Validators.maxLength(128)],
    ],
    mainContactName: [
      initialOrganization.mainContactName,
      [Validators.required, Validators.maxLength(128)],
    ],
    mainContactPhoneNumber: [
      initialOrganization.mainContactPhoneNumber,
      [Validators.required, Validators.maxLength(128), phoneNumberValidator],
    ],
    mainContactEmail: [
      initialOrganization.mainContactEmail,
      [Validators.required, Validators.maxLength(128), Validators.email],
    ],
    technicalContactSameAsMain: [
      initialOrganization.technicalContactSameAsMain,
      [Validators.required],
    ],
    technicalContactName: [
      initialOrganization.technicalContactName,
      [Validators.required, Validators.maxLength(128)],
    ],
    technicalContactPhoneNumber: [
      initialOrganization.technicalContactPhoneNumber,
      [Validators.required, Validators.maxLength(128), phoneNumberValidator],
    ],
    technicalContactEmail: [
      initialOrganization.technicalContactEmail,
      [Validators.required, Validators.maxLength(128), Validators.email],
    ],
  });
};
