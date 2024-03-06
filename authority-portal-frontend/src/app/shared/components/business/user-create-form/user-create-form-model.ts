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

export interface UserCreateFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  jobTitle: FormControl<string>;
  phoneNumber: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export type UserCreateFormValue = ɵFormGroupRawValue<UserCreateFormModel>;

export const DEFAULT_USER_CREATE_FORM_MODEL: UserCreateFormValue = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
};
