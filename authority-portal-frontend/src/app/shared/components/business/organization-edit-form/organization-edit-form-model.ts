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

export interface OrganizationEditFormModel {
  website: FormControl<string>;
  businessUnit: FormControl<string>;
  industry: FormControl<string>;
  description: FormControl<string>;

  mainAddress: FormControl<string>;

  billingAddressSameAsMain: FormControl<boolean>;
  billingAddress: FormControl<string>;

  mainContactName: FormControl<string>;
  mainContactPhoneNumber: FormControl<string>;
  mainContactEmail: FormControl<string>;

  technicalContactSameAsMain: FormControl<boolean>;
  technicalContactName: FormControl<string>;
  technicalContactPhoneNumber: FormControl<string>;
  technicalContactEmail: FormControl<string>;
}

export type OrganizationEditFormValue =
  ɵFormGroupRawValue<OrganizationEditFormModel>;
