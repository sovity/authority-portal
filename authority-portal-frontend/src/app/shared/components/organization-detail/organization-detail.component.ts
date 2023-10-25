import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OrganizationDetailsDto} from '@sovity.de/authority-portal-client';
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
export class OrganizationDetailComponent {
  @Input() organization!: OrganizationDetailsDto;
  @Input() type!: 'Participant' | 'Authority';
  @Output() actions = new EventEmitter<OrganizationActions>();

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
