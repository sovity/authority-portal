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
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export const namedRegexValidator =
  (regex: RegExp, key: string): ValidatorFn =>
  (c: AbstractControl): ValidationErrors | null => {
    if (!c.value) {
      return null;
    }
    return regex.test(c.value) ? null : {[key]: true};
  };
