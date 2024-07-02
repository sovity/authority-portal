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
import {RegistrationRequestDto} from '@sovity.de/authority-portal-client';
import {getMainAndBillingAddresses} from 'src/app/core/utils/address-utils';
import {getMainAndTechnicalContacts} from 'src/app/core/utils/name-utils';
import {RegistrationWizardFormValue} from './organization-create-page.form-model';

export function buildRegistrationRequest(
  formValue: RegistrationWizardFormValue,
): RegistrationRequestDto {
  let user = formValue.userTab;
  let org = formValue.organizationTab;

  const {mainAddress, billingAddress} = getMainAndBillingAddresses(org);

  const {
    mainContactName,
    mainContactEmail,
    mainContactPhone,
    technicalContactName,
    technicalContactEmail,
    technicalContactPhone,
  } = getMainAndTechnicalContacts(org);

  return {
    // User Profile
    userEmail: user?.email || '',
    userFirstName: user?.firstName || '',
    userLastName: user?.lastName || '',
    userJobTitle: user?.jobTitle || '',
    userPhone: user?.phoneNumber || '',
    userPassword: user?.password || '',

    // Organization
    organizationName: org?.legalName || '',

    // Organization Metadata
    organizationUrl: org?.website || '',
    organizationDescription: org?.description || '',
    organizationBusinessUnit: org?.businessUnit || '',
    organizationIndustry: org?.industry || '',
    organizationAddress: mainAddress,
    organizationBillingAddress: billingAddress,
    organizationLegalIdType: org?.legalIdType!,
    organizationLegalIdNumber: org?.legalId || '',
    organizationCommerceRegisterLocation: org?.commerceRegisterLocation || '',

    // Organization Contacts
    organizationMainContactName: mainContactName,
    organizationMainContactEmail: mainContactEmail,
    organizationMainContactPhone: mainContactPhone,
    organizationTechContactName: technicalContactName,
    organizationTechContactEmail: technicalContactEmail,
    organizationTechContactPhone: technicalContactPhone,
  };
}
