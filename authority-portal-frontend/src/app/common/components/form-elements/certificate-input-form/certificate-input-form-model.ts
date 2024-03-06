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

export interface CertificateFormModel {
  bringOwnCert: FormControl<boolean>;
  ownCertificate: FormControl<string>;

  organizationalUnit: FormControl<string>;
  email: FormControl<string>;
  state: FormControl<string>;
  city: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  generatedCertificate: FormControl<string>;
}

export type CertificateFormValue = ɵFormGroupRawValue<CertificateFormModel>;

export const DEFAULT_CERTIFICATE_FORM_VALUE: CertificateFormValue = {
  bringOwnCert: false,
  ownCertificate: '',
  organizationalUnit: '',
  email: '',
  state: '',
  city: '',
  password: '',
  confirmPassword: '',
  generatedCertificate: '',
};
