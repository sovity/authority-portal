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

import {AbstractControl, ValidatorFn} from '@angular/forms';

export const passwordMatchValidator =
  (passwordCtrlPath: string, repeatCtrlPath: string): ValidatorFn =>
  (c: AbstractControl) => {
    const passwordCtrl = c.get(passwordCtrlPath);
    const repeatCtrl = c.get(repeatCtrlPath);
    if (passwordCtrl?.disabled || repeatCtrl?.disabled) {
      return null;
    }

    const password = passwordCtrl?.value;
    const confirmPassword = repeatCtrl?.value;
    return password === confirmPassword ? null : {mismatch: true};
  };
