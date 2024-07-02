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

/**
 * Takes the year/month/day information of a local date and creates a new Date object from it.
 * Hour offset context is removed.
 * Can be used to ensure dates are displayed identically across different timezones when stringified in JSON payloads.
 * @param date date to convert
 */
import {format} from 'date-fns-tz';

export function toGmtZeroHourDate(date: Date): Date {
  return new Date(format(date, 'yyyy-MM-dd'));
}
