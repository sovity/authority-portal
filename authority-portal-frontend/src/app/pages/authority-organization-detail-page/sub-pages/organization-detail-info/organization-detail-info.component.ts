import {Component, Input} from '@angular/core';
import {OrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {mapRolesToReadableFormat} from 'src/app/core/utils/user-role-utils';

@Component({
  selector: 'app-organization-detail-info',
  templateUrl: './organization-detail-info.component.html',
})
export class OrganizationDetailInfoComponent {
  @Input() organization!: OrganizationDetailsDto;

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }
}
