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
import {FormControl, ɵFormGroupRawValue} from '@angular/forms';
import {OrganizationLegalIdTypeDto} from '@sovity.de/authority-portal-client';

export interface OrganizationCreateFormModel {
  legalName: FormControl<string>;
  website: FormControl<string>;
  businessUnit: FormControl<string>;
  industry: FormControl<string>;
  description: FormControl<string>;

  mainAddressStreet: FormControl<string>;
  mainAddressCity: FormControl<string>;
  mainAddressHouseNo: FormControl<string>;
  mainAddressZipCode: FormControl<string>;
  mainAddressCountry: FormControl<string>;

  billingAddressSameAsMain: FormControl<boolean>;
  billingAddressStreet: FormControl<string>;
  billingAddressCity: FormControl<string>;
  billingAddressHouseNo: FormControl<string>;
  billingAddressZipCode: FormControl<string>;
  billingAddressCountry: FormControl<string>;

  mainContactFirstName: FormControl<string>;
  mainContactLastName: FormControl<string>;
  mainContactPhoneNumber: FormControl<string>;
  mainContactEmail: FormControl<string>;

  technicalContactSameAsMain: FormControl<boolean>;
  technicalContactFirstName: FormControl<string>;
  technicalContactLastName: FormControl<string>;
  technicalContactPhoneNumber: FormControl<string>;
  technicalContactEmail: FormControl<string>;

  legalIdType: FormControl<OrganizationLegalIdTypeDto>;
  legalId: FormControl<string>;
  commerceRegisterLocation: FormControl<string>;
}

export type OrganizationCreateFormValue =
  ɵFormGroupRawValue<OrganizationCreateFormModel>;

export const DEFAULT_ORGANIZATION_CREATE_FORM_MODEL: OrganizationCreateFormValue =
  {
    legalName: '',
    website: '',
    businessUnit: '',
    industry: '',
    description: '',

    mainAddressStreet: '',
    mainAddressCity: '',
    mainAddressHouseNo: '',
    mainAddressZipCode: '',
    mainAddressCountry: '',

    billingAddressSameAsMain: true,
    billingAddressStreet: '',
    billingAddressCity: '',
    billingAddressHouseNo: '',
    billingAddressZipCode: '',
    billingAddressCountry: '',

    legalIdType: OrganizationLegalIdTypeDto.TaxId,
    legalId: '',
    commerceRegisterLocation: '',

    mainContactFirstName: '',
    mainContactLastName: '',
    mainContactPhoneNumber: '',
    mainContactEmail: '',
    technicalContactSameAsMain: true,
    technicalContactFirstName: '',
    technicalContactLastName: '',
    technicalContactPhoneNumber: '',
    technicalContactEmail: '',
  };
