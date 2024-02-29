import {Component, Input} from '@angular/core';
import {
  OrganizationDetailsDto,
  OwnOrganizationDetailsDto,
} from '@sovity.de/authority-portal-client';

@Component({
  selector: 'app-shared-organization-detail',
  templateUrl: './shared-organization-detail.component.html',
})
export class SharedOrganizationDetailComponent {
  @Input() organization!: OrganizationDetailsDto | OwnOrganizationDetailsDto;
}
