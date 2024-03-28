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
import {UserEditFormModel, UserEditFormValue} from './user-edit-form-model';

export const buildUserEditForm = (
  formBuilder: FormBuilder,
  initialUser: UserEditFormValue,
): FormGroup<UserEditFormModel> => {
  return formBuilder.nonNullable.group({
    firstName: [
      initialUser.firstName,
      [Validators.required, Validators.maxLength(128)],
    ],
    lastName: [
      initialUser.lastName,
      [Validators.required, Validators.maxLength(128)],
    ],
    email: [
      initialUser.email,
      [Validators.required, Validators.maxLength(128), Validators.email],
    ],
    jobTitle: [
      initialUser.jobTitle,
      [Validators.required, Validators.maxLength(128)],
    ],
    phoneNumber: [
      initialUser.phoneNumber,
      [
        Validators.required,
        phoneNumberValidator,
        Validators.minLength(5),
        Validators.maxLength(28),
      ],
    ],
  });
};
