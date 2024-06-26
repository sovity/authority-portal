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
import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { validUrlPattern } from 'src/app/core/utils/validators/url-validator';
import { PropertyGridField } from './property-grid-field';


@Injectable({providedIn: 'root'})
export class PropertyGridFieldService {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  guessValue(
    value: string | null | undefined,
  ): Pick<PropertyGridField, 'url' | 'text' | 'additionalClasses'> {
    return {
      text: value || '-',
      url: value?.match(validUrlPattern) ? value : undefined,
      additionalClasses: value?.includes(' ') ? undefined : 'break-all',
    };
  }

  formatDate(date: Date | null | undefined): string {
    if (!date) {
      return '';
    }

    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', this.locale);
  }
}
