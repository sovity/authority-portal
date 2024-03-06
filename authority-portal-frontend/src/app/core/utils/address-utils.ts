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
export function buildAddressString(formValue: {
  street?: string;
  houseNo?: string;
  zipCode?: string;
  city?: string;
  country?: string;
}): string {
  return `${formValue.street} ${formValue.houseNo}, ${formValue.zipCode} ${formValue.city}, ${formValue.country}`;
}

export function getMainAndBillingAddresses(formValue?: {
  mainAddressStreet: string;
  mainAddressCity: string;
  mainAddressHouseNo: string;
  mainAddressZipCode: string;
  mainAddressCountry: string;

  billingAddressSameAsMain: boolean;
  billingAddressStreet: string;
  billingAddressCity: string;
  billingAddressHouseNo: string;
  billingAddressZipCode: string;
  billingAddressCountry: string;
}): {mainAddress: string; billingAddress: string} {
  let mainAddress = buildAddressString({
    street: formValue?.mainAddressStreet,
    houseNo: formValue?.mainAddressHouseNo,
    zipCode: formValue?.mainAddressHouseNo,
    city: formValue?.mainAddressCity,
    country: formValue?.mainAddressCountry,
  });

  let billingAddress = formValue?.billingAddressSameAsMain
    ? mainAddress
    : buildAddressString({
        street: formValue?.billingAddressStreet,
        houseNo: formValue?.billingAddressHouseNo,
        zipCode: formValue?.billingAddressHouseNo,
        city: formValue?.billingAddressCity,
        country: formValue?.billingAddressCountry,
      });

  return {mainAddress, billingAddress};
}
