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

import {OrganizationEditFormValue} from './organization-edit-form-model';

export const organizationEditFormEnabledCtrls = (
  value: OrganizationEditFormValue,
): Record<keyof OrganizationEditFormValue, boolean> => {
  const billingAddressEnabled = !value.billingAddressSameAsMain;
  const technicalContactEnabled = !value.technicalContactSameAsMain;

  return {
    website: true,
    businessUnit: true,
    industry: true,
    description: true,

    mainAddress: true,

    billingAddressSameAsMain: true,
    billingAddress: billingAddressEnabled,

    mainContactName: true,
    mainContactPhoneNumber: true,
    mainContactEmail: true,
    technicalContactSameAsMain: true,
    technicalContactName: technicalContactEnabled,
    technicalContactPhoneNumber: technicalContactEnabled,
    technicalContactEmail: technicalContactEnabled,
  };
};
