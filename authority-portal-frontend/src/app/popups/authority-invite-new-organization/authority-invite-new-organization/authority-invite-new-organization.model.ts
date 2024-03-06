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

export type AuthorityInviteNewOrganizationPageFormValue =
  ɵFormGroupRawValue<AuthorityInviteNewOrganizationPageFormModel>;

export interface AuthorityInviteNewOrganizationPageFormModel {
  userEmail: FormControl<string>;
  userFirstName: FormControl<string>;
  userLastName: FormControl<string>;
  orgName: FormControl<string>;
  userJobTitle: FormControl<string>;
  userPhoneNumber: FormControl<string>;
}

export const DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_FORM_VALUE: AuthorityInviteNewOrganizationPageFormValue =
  {
    userEmail: '',
    userFirstName: '',
    userLastName: '',
    orgName: '',
    userJobTitle: '',
    userPhoneNumber: '',
  };
