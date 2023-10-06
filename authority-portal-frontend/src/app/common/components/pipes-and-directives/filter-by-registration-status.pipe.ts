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
    filter: OrganizationRegistrationStatusDto | null,
  ): OrganizationOverviewEntryDto[] {
    if (!items || !filter || filter == null) {
      return items;
    }
    return items.filter((item) => item.registrationStatus === filter);
  }
}
