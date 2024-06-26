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
import {certificateValidator} from 'src/app/core/utils/validators/certificate-validator';
import {notBlankValidator} from 'src/app/core/utils/validators/not-blank-validator';
import {passwordEntropyValidator} from 'src/app/core/utils/validators/password-entropy-validator';
import {passwordMatchValidator} from 'src/app/core/utils/validators/password-match-validator';
import {
  CertificateFormModel,
  CertificateFormValue,
} from './certificate-input-form-model';

export const buildCertificateInputForm = (
  formBuilder: FormBuilder,
  initial: CertificateFormValue,
): FormGroup<CertificateFormModel> =>
  formBuilder.nonNullable.group(
    {
      bringOwnCert: [initial.bringOwnCert],
      ownCertificate: [
        initial.ownCertificate,
        [Validators.required, certificateValidator],
      ],
      organizationalUnit: [
        initial.organizationalUnit,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      email: [
        initial.email,
        [Validators.required, Validators.email, Validators.maxLength(128)],
      ],
      state: [
        initial.state,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      city: [
        initial.city,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      password: [
        initial.password,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
          passwordEntropyValidator,
          notBlankValidator(),
        ],
      ],
      confirmPassword: [initial.confirmPassword, [Validators.required]],
      generatedCertificate: [
        initial.generatedCertificate,
        [Validators.required],
      ],
    },
    {validators: passwordMatchValidator('password', 'confirmPassword')},
  );
