import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import {UserRoleDto} from '@sovity.de/authority-portal-client';
import {
  getHighestApplicationRole,
  getHighestParticipantRole,
  mapRolesToReadableFormat,
} from 'src/app/core/utils/user-role-utils';
import {
  UserDetailConfig,
  UserRoleUpdate,
  UserRoleUpdateType,
} from './shared-user-detail.model';

@Component({
  selector: 'app-shared-user-detail',
  templateUrl: './shared-user-detail.component.html',
})
export class SharedUserDetailComponent {
  @Input() userDetailConfig!: UserDetailConfig;
  @Input() availableApplicationRoles: string[] = [];
  @Input() availableParticipantRoles: string[] = [];
  @Input() usageType: 'DETAIL_PAGE' | 'SETTINGS_PAGE' = 'SETTINGS_PAGE';
  @Output() onUserRoleUpdate = new EventEmitter<UserRoleUpdate>();

  currentTopApplicationRole: UserRoleDto | null = null;
  currentTopParticipantRole: UserRoleDto | null = null;

  newTopApplicationRole: UserRoleDto | null = null;
  newTopParticipantRole: UserRoleDto | null = null;

  roleFormEnable: boolean = false;

  ngOnInit(): void {
    this.setupRoleForm();
  }

  setupRoleForm() {
    this.currentTopApplicationRole = getHighestApplicationRole(
      this.userDetailConfig.user.roles,
    );
    this.currentTopParticipantRole = getHighestParticipantRole(
      this.userDetailConfig.user.roles,
    );

    this.newTopApplicationRole = this.currentTopApplicationRole;
    this.newTopParticipantRole = this.currentTopParticipantRole;
  }

  toggleRoleForm() {
    this.roleFormEnable = !this.roleFormEnable;
  }

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }

  rolesToList(array: string[]): string {
    return array
      .map((element) => this.mapToReadable(element))
      .sort()
      .join(', ');
  }

  roleChangeHandled(
    event: MatSelectChange,
    type: 'APPLICATION' | 'PARTICIPANT',
  ) {
    this.roleFormEnable = true;

    if (type === 'APPLICATION') {
      if (event.value === 'NONE') {
        this.newTopApplicationRole = null;
        return;
      }

      this.newTopApplicationRole = event.value;
    } else if (type === 'PARTICIPANT') {
      this.newTopParticipantRole = event.value as UserRoleDto;
    }
  }

  updateUserRoles() {
    this.roleFormEnable = false;
    if (
      this.newTopApplicationRole &&
      this.newTopApplicationRole !== this.currentTopApplicationRole
    ) {
      this.onUserRoleUpdate.emit({
        type: UserRoleUpdateType.APPLICATION,
        role: this.newTopApplicationRole,
      });
    }
    if (
      this.newTopParticipantRole &&
      this.newTopParticipantRole !== this.currentTopParticipantRole
    ) {
      this.onUserRoleUpdate.emit({
        type: UserRoleUpdateType.PARTICIPANT,
        role: this.newTopParticipantRole,
      });
    }

    if (this.newTopApplicationRole === null) {
      this.onUserRoleUpdate.emit({
        type: UserRoleUpdateType.PARTICIPANT,
        role: null,
      });
    }
  }

  cancelUserRoleUpdate() {
    this.roleFormEnable = false;
  }

  onboardingType(type: string) {
    switch (type) {
      case 'INVITATION':
        return 'Invitation';
      case 'SELF_REGISTRATION':
        return 'Self Registration';
      default:
        return '';
    }
  }
}
