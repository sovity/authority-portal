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
import {passwordEntropyValidator} from '../../../../core/utils/validators/password-entropy-validator';
import {passwordMatchValidator} from '../../../../core/utils/validators/password-match-validator';
import {phoneNumberValidator} from '../../../../core/utils/validators/phone-number-validator';
import {
  UserCreateFormModel,
  UserCreateFormValue,
} from './user-create-form-model';

export const buildUserCreateForm = (
  formBuilder: FormBuilder,
  initialUser: UserCreateFormValue,
): FormGroup<UserCreateFormModel> => {
  return formBuilder.nonNullable.group(
    {
      firstName: [
        initialUser.firstName,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      lastName: [
        initialUser.lastName,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      jobTitle: [
        initialUser.jobTitle,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
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
      email: [
        initialUser.email,
        [
          Validators.required,
          Validators.maxLength(128),
          notBlankValidator(),
          Validators.email,
        ],
      ],
      password: [
        initialUser.password,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
          notBlankValidator(),
          passwordEntropyValidator,
        ],
      ],
      confirmPassword: [initialUser.password, [Validators.required]],
    },
    {validators: passwordMatchValidator('password', 'confirmPassword')},
  );
};
