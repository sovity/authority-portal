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

import {CertificateFormValue} from './certificate-input-form-model';

export const certificateInputFormEnabledCtrls = (
  value: CertificateFormValue,
): Record<keyof CertificateFormValue, boolean> => {
  let isOwnCert = value.bringOwnCert;
  return {
    bringOwnCert: true,
    ownCertificate: isOwnCert,

    organizationalUnit: !isOwnCert,
    email: !isOwnCert,
    state: !isOwnCert,
    city: !isOwnCert,
    password: !isOwnCert,
    confirmPassword: !isOwnCert,
    generatedCertificate: !isOwnCert,
  };
};
