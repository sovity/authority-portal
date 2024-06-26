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
import { ValidatorFn, Validators } from '@angular/forms';


/**
 * Validator function for checking the validity of a subdomain.
 * @returns Validator function to be used with Reactive Forms.
 */
export const subdomainValidators: ValidatorFn[] = [
  Validators.pattern(/^[a-z][a-z\d-]+[a-z\d]$/),
  Validators.minLength(6),
  Validators.maxLength(23),
];
