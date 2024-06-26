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
 * Creates Compare By Function for Angular Material compareWith parameters
 */
@Pipe({name: 'compareByField'})
export class CompareByFieldPipe implements PipeTransform {
  transform(key: string): (a: any, b: any) => boolean {
    return (a, b) =>
      a === b ||
      (typeof a === 'object' && typeof b === 'object' && a[key] === b[key]);
  }
}
