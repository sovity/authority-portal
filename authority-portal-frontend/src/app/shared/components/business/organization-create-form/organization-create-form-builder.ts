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
import {zipCodeValidator} from '../../../../core/utils/validators/zipcode-validator';
import {
  OrganizationCreateFormModel,
  OrganizationCreateFormValue,
} from './organization-create-form-model';

export const buildOrganizationCreateForm = (
  formBuilder: FormBuilder,
  initialOrganization: OrganizationCreateFormValue,
): FormGroup<OrganizationCreateFormModel> => {
  return formBuilder.nonNullable.group({
    legalName: [
      initialOrganization.legalName,
      [Validators.required, Validators.maxLength(128)],
    ],
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
      [Validators.required, Validators.maxLength(128)],
    ],
    mainAddressStreet: [
      initialOrganization.mainAddressStreet,
      [Validators.required, Validators.maxLength(128)],
    ],
    mainAddressCity: [
      initialOrganization.mainAddressCity,
      [Validators.required, Validators.maxLength(128)],
    ],
    mainAddressHouseNo: [
      initialOrganization.mainAddressHouseNo,
      [Validators.required, Validators.maxLength(128)],
    ],
    mainAddressZipCode: [
      initialOrganization.mainAddressZipCode,
      [Validators.required, Validators.maxLength(128), zipCodeValidator],
    ],
    mainAddressCountry: [
      initialOrganization.mainAddressCountry,
      [Validators.required, Validators.maxLength(128)],
    ],
    billingAddressSameAsMain: [true],
    billingAddressStreet: [
      initialOrganization.billingAddressStreet,
      [Validators.required, Validators.maxLength(128)],
    ],
    billingAddressCity: [
      initialOrganization.billingAddressCity,
      [Validators.required, Validators.maxLength(128)],
    ],
    billingAddressHouseNo: [
      initialOrganization.billingAddressHouseNo,
      [Validators.required, Validators.maxLength(128)],
    ],
    billingAddressZipCode: [
      initialOrganization.billingAddressZipCode,
      [Validators.required, Validators.maxLength(128), zipCodeValidator],
    ],
    billingAddressCountry: [
      initialOrganization.billingAddressCountry,
      [Validators.required, Validators.maxLength(128)],
    ],
    legalIdType: [initialOrganization.legalIdType, [Validators.required]],
    legalId: [
      initialOrganization.legalId,
      [Validators.required, Validators.maxLength(128)],
    ],
    commerceRegisterLocation: [
      initialOrganization.commerceRegisterLocation,
      [Validators.required, Validators.maxLength(128)],
    ],
    mainContactFirstName: [
      initialOrganization.mainContactFirstName,
      [Validators.required, Validators.maxLength(128)],
    ],
    mainContactLastName: [
      initialOrganization.mainContactLastName,
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
    technicalContactSameAsMain: [true],
    technicalContactFirstName: [
      initialOrganization.technicalContactFirstName,
      [Validators.required, Validators.maxLength(128)],
    ],
    technicalContactLastName: [
      initialOrganization.technicalContactLastName,
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
