import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  OrganizationDetailsDto,
  OwnOrganizationDetailsDto,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {
  getOrganizationRegistrationStatusClasses,
  getOrganizationUserRegistrationStatusClasses,
} from 'src/app/core/utils/ui-utils';

export enum OrganizationActions {
  REJECT = 'reject',
  APPROVE = 'approve',
}

@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html',
})
export class OrganizationDetailComponent implements OnInit {
  @Input() organization!: OrganizationDetailsDto | OwnOrganizationDetailsDto;
  @Input() type!: 'Participant' | 'Authority';
  @Output() actions = new EventEmitter<OrganizationActions>();

  dashboard!: {
    dataOfferCount: number;
    connectorCount: number;
    memberCount: number;
  };

  ngOnInit() {
    this.dashboard = {
      dataOfferCount: (this.organization as OrganizationDetailsDto)
        .dataOfferCount,
      connectorCount: (this.organization as OrganizationDetailsDto)
        .connectorCount,
      memberCount: (this.organization as OrganizationDetailsDto).memberCount,
    };
  }

  // html doesn't see this function if it's just imported
  getOrganizationRegistrationStatusClasses =
    getOrganizationRegistrationStatusClasses;

  getOrganizationUserRegistrationStatusClasses =
    getOrganizationUserRegistrationStatusClasses;

  approve() {
    this.actions.emit(OrganizationActions.APPROVE);
  }

  reject() {
    this.actions.emit(OrganizationActions.REJECT);
  }
}
