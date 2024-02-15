import {Component, Input} from '@angular/core';
import {
  OrganizationDetailsDto,
  OrganizationLegalIdTypeDto,
  OwnOrganizationDetailsDto,
} from '@sovity.de/authority-portal-client';

@Component({
  selector: 'app-shared-organization-detail',
  templateUrl: './shared-organization-detail.component.html',
})
export class SharedOrganizationDetailComponent {
  @Input() organization!: OrganizationDetailsDto | OwnOrganizationDetailsDto;

  idType: {[key in OrganizationLegalIdTypeDto]: string} = {
    TAX_ID: 'Tax ID',
    COMMERCE_REGISTER_INFO: 'Commercial Register ',
  };
}
