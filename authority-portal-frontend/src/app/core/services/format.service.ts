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
import { formatNumber } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class FormatService {

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  formatNumber(value: number | null | undefined, digitsInfo?: string): string {
    return value == null ? "" : formatNumber(value, this.locale, digitsInfo);
  }

  formatInteger(value: number | null | undefined): string {
    return this.formatNumber(value, '1.0-0');
  }
}
