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
import {notBlankValidator} from 'src/app/core/utils/validators/not-blank-validator';
import {phoneNumberValidator} from 'src/app/core/utils/validators/phone-number-validator';
import {urlValidator} from 'src/app/core/utils/validators/url-validator';
import {zipCodeValidator} from 'src/app/core/utils/validators/zipcode-validator';
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
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    website: [
      initialOrganization.website,
      [Validators.required, Validators.maxLength(128), urlValidator],
    ],
    businessUnit: [
      initialOrganization.businessUnit,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    industry: [initialOrganization.industry, [Validators.required]],
    description: [
      initialOrganization.description,
      [Validators.required, Validators.maxLength(4096), notBlankValidator()],
    ],
    mainAddressStreet: [
      initialOrganization.mainAddressStreet,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    mainAddressCity: [
      initialOrganization.mainAddressCity,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    mainAddressHouseNo: [
      initialOrganization.mainAddressHouseNo,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    mainAddressZipCode: [
      initialOrganization.mainAddressZipCode,
      [Validators.required, Validators.maxLength(128), zipCodeValidator],
    ],
    mainAddressCountry: [
      initialOrganization.mainAddressCountry,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    billingAddressSameAsMain: [true],
    billingAddressStreet: [
      initialOrganization.billingAddressStreet,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    billingAddressCity: [
      initialOrganization.billingAddressCity,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    billingAddressHouseNo: [
      initialOrganization.billingAddressHouseNo,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    billingAddressZipCode: [
      initialOrganization.billingAddressZipCode,
      [Validators.required, Validators.maxLength(128), zipCodeValidator],
    ],
    billingAddressCountry: [
      initialOrganization.billingAddressCountry,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    legalIdType: [initialOrganization.legalIdType, [Validators.required]],
    legalId: [
      initialOrganization.legalId,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    commerceRegisterLocation: [
      initialOrganization.commerceRegisterLocation,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    mainContactFirstName: [
      initialOrganization.mainContactFirstName,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    mainContactLastName: [
      initialOrganization.mainContactLastName,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    mainContactPhoneNumber: [
      initialOrganization.mainContactPhoneNumber,
      [
        Validators.required,
        phoneNumberValidator,
        Validators.minLength(5),
        Validators.maxLength(28),
        notBlankValidator(),
      ],
    ],
    mainContactEmail: [
      initialOrganization.mainContactEmail,
      [Validators.required, Validators.maxLength(128), Validators.email],
    ],
    technicalContactSameAsMain: [true],
    technicalContactFirstName: [
      initialOrganization.technicalContactFirstName,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    technicalContactLastName: [
      initialOrganization.technicalContactLastName,
      [Validators.required, Validators.maxLength(128), notBlankValidator()],
    ],
    technicalContactPhoneNumber: [
      initialOrganization.technicalContactPhoneNumber,
      [
        Validators.required,
        phoneNumberValidator,
        Validators.minLength(5),
        Validators.maxLength(28),
        notBlankValidator(),
      ],
    ],
    technicalContactEmail: [
      initialOrganization.technicalContactEmail,
      [Validators.required, Validators.maxLength(128), Validators.email],
    ],
  });
};
