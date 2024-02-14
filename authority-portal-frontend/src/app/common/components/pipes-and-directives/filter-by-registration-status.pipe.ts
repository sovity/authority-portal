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
