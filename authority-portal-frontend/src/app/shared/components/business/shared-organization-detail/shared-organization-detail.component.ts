import {Component, HostBinding, Input} from '@angular/core';
import {
  OrganizationDetailsDto,
  OwnOrganizationDetailsDto,
} from '@sovity.de/authority-portal-client';

@Component({
  selector: 'app-shared-organization-detail',
  templateUrl: './shared-organization-detail.component.html',
})
export class SharedOrganizationDetailComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.my-6')
  cls = true;

  @Input() organization!: OrganizationDetailsDto | OwnOrganizationDetailsDto;
}
