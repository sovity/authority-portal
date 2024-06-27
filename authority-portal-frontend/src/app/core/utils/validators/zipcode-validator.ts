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
import {ValidatorFn} from '@angular/forms';
import {namedRegexValidator} from './named-regex-validator';

export const validZipCodePattern =
  /^[a-zA-Z0-9][a-zA-Z0-9\- ]{0,10}[a-zA-Z0-9]$/;

export const zipCodeValidator: ValidatorFn = namedRegexValidator(
  validZipCodePattern,
  'zipCode',
);
