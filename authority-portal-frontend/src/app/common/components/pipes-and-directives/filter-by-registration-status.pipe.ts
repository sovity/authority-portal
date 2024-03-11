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
import {
  OrganizationOverviewEntryDto,
  OrganizationRegistrationStatusDto,
} from '@sovity.de/authority-portal-client';

@Pipe({
  name: 'sortingFilter',
})
export class FilterByRegistrationStatusPipe implements PipeTransform {
  transform(
    items: OrganizationOverviewEntryDto[],
    filter:
      | OrganizationRegistrationStatusDto
      | OrganizationRegistrationStatusDto[]
      | null,
  ): OrganizationOverviewEntryDto[] {
    if (!items || !filter || filter.length === 0) {
      return items;
    }

    if (Array.isArray(filter)) {
      // If filter is an array, filter by multiple statuses
      return items.filter((item) => filter.includes(item.registrationStatus));
    } else {
      // If filter is a single object, filter by that status
      return items.filter((item) => item.registrationStatus === filter);
    }
  }
}
