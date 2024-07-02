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
import {Pipe, PipeTransform} from '@angular/core';

/**
 * `Object.values(...)` can't be used from angular templates.
 */
@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
  transform<T>(obj: T): T[keyof T][] {
    return Object.values(obj || {});
  }
}
