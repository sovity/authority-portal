import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MemberInfo} from '@sovity.de/authority-portal-client';
import {getOrganizationUserRegistrationStatusClasses} from 'src/app/core/utils/ui-utils';
import {
  getHighestApplicationRole,
  getHighestParticipantRole,
  mapRolesToReadableFormat,
} from 'src/app/core/utils/user-role-utils';

export interface Members extends MemberInfo {
  applicationRole: string;
  participantRole: string;
}

@Component({
  selector: 'app-shared-user-list',
  templateUrl: './shared-user-list.component.html',
})
export class SharedUserListComponent implements OnInit {
  @Input() organizationId!: string;
  @Input() members!: MemberInfo[];
  @Output() selectUserEvent = new EventEmitter<MemberInfo>();

  modifiedMembers!: Members[];

  getOrganizationUserRegistrationStatusClasses =
    getOrganizationUserRegistrationStatusClasses;
  selectedRole: any;

  ngOnInit(): void {
    this.modifiedMembers = this.members.map((member: MemberInfo) => {
      return {
        ...member,
        applicationRole: this.mapToReadable(
          getHighestApplicationRole(member.roles),
        ),
        participantRole: this.mapToReadable(
          getHighestParticipantRole(member.roles),
        ),
      };
    });
  }

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role) !== 'None'
      ? mapRolesToReadableFormat(role)
      : '';
  }

  selectUser(user: MemberInfo) {
    this.selectUserEvent.emit(user);
  }
}
