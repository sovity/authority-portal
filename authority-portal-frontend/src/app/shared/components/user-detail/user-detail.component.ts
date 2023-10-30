import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {UserDetailDto, UserRoleDto} from '@sovity.de/authority-portal-client';
import {
  buildRoleSelectConfig,
  mapRolesToReadableFormat,
  roleSelectConfig,
} from 'src/app/core/utils/user-role-utils';
import {
  UpdateAuthorityUserRoles,
  UpdateUserRoles,
} from 'src/app/pages/authority-organization-user-detail-page/state/authority-organization-user-detail-page-actions';

export interface UserRolesMgmt {
  allRoles: UserRoleDto[];
  userRoles: UserRoleDto[];
  updatedRole?: UserRoleDto;
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  @Input() userId!: string;
  @Input() user!: UserDetailDto;
  @Input() type!: 'AUTHORITY' | 'PARTICIPANT' | 'PROFILE_PAGE';

  roleFormEnable: boolean = false;
  isUpdateRoleActive: boolean = false;
  participantsUserRole!: string;
  authorityUserRole!: string;
  authorityRoles: UserRolesMgmt = {allRoles: [], userRoles: []};
  participantRoles: UserRolesMgmt = {allRoles: [], userRoles: []};

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.authorityRoles.allRoles = roleSelectConfig('AUTHORITY');
    this.participantRoles.allRoles = roleSelectConfig('PARTICIPANT');
    this.participantsUserRole = buildRoleSelectConfig(
      this.user.roles,
      'PARTICIPANT',
    );
    this.authorityUserRole = buildRoleSelectConfig(
      this.user.roles,
      'AUTHORITY',
    );
  }

  toggleRoleForm() {
    this.roleFormEnable = !this.roleFormEnable;
  }

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }

  rolesToList(array: string[]): string {
    return array.map((element) => this.mapToReadable(element)).join(', ');
  }

  roleChangeHandled(
    role: UserRoleDto | any,
    type: 'AUTHORITY' | 'PARTICIPANT',
  ) {
    this.isUpdateRoleActive = true;

    if (type === 'AUTHORITY') {
      this.authorityRoles.updatedRole = role;
    } else if (type === 'PARTICIPANT') {
      this.participantRoles.updatedRole = role;
    }
  }

  updateUserRoles() {
    this.isUpdateRoleActive = false;
    if (this.authorityRoles?.updatedRole) {
      this.store.dispatch(
        new UpdateAuthorityUserRoles(
          this.userId,
          this.authorityRoles.updatedRole!,
        ),
      );
    }
    if (this.participantRoles?.updatedRole) {
      this.store.dispatch(
        new UpdateUserRoles(this.userId, this.participantRoles.updatedRole!),
      );
    }
  }
}
