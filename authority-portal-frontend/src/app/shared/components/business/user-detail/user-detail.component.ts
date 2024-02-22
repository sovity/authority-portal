import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngxs/store';
import {UserDetailDto, UserRoleDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {
  getHighestApplicationRole,
  getHighestParticipantRole,
  isApplicationRole,
  mapRolesToReadableFormat,
} from 'src/app/core/utils/user-role-utils';
import {
  ClearUserApplicationRoleAsAuthority,
  UpdateUserApplicationRoleAsAuthority,
  UpdateUserParticipantRoleAsAuthority,
} from 'src/app/pages/authority-organization-user-detail-page/state/authority-organization-user-detail-page-actions';
import {
  ClearUserApplicationRole,
  UpdateUserApplicationRole,
  UpdateUserParticipantRole,
} from 'src/app/pages/participant-user-detail-page/state/particpant-user-detail-page-actions';

export interface UserRolesMgmt {
  allRoles: (UserRoleDto | null)[];
  userRoles: (UserRoleDto | null)[];
  updatedRole?: UserRoleDto | null;
}

export interface UserAction {
  type: 'REACTIVATE' | 'DEACTIVATE';
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  @Input() userId!: string;
  @Input() user!: UserDetailDto;
  @Input() type!: 'AUTHORITY_VIEW' | 'INTERNAL_VIEW' | 'OWN';
  @Output() userAction = new EventEmitter<UserAction>();

  ownerMdsId: string = '';
  userMdsId: string = '';
  sameOrganization: boolean = false;

  roleFormEnable: boolean = false;
  isUpdateRoleActive: boolean = false;

  updatePermittedRoles: UserRoleDto[] = ['USER'];

  availableApplicationRoles: string[] = [];
  availableParticipantRoles: string[] = Object.values(UserRoleDto).filter(
    (role: UserRoleDto) => !isApplicationRole(role),
  ) as string[];

  currentTopApplicationRole: UserRoleDto | null = null;
  currentTopParticipantRole: UserRoleDto | null = null;

  newTopApplicationRole: UserRoleDto | null = null;
  newTopParticipantRole: UserRoleDto | null = null;

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.setUpUpdatePermittedRoles(this.type);

    this.globalStateUtils.userInfo$.subscribe((userInfo) => {
      this.ownerMdsId = userInfo.organizationMdsId;

      this.availableApplicationRoles = this.getAvailableApplicationRoles(
        Array.from(userInfo.roles),
      );
    });

    this.route.url.subscribe((segments) => {
      if (
        segments[1].path === 'organizations' &&
        segments[2].path.startsWith('MDSL')
      ) {
        this.userMdsId = segments[2].path;
      }

      if (segments[0].path === 'my-organization') {
        this.userMdsId = this.ownerMdsId;
      }

      if (this.userMdsId === this.ownerMdsId) {
        this.sameOrganization = true;
      }
    });

    if (this.user) {
      this.currentTopApplicationRole = getHighestApplicationRole(
        this.user.roles,
      );
      this.currentTopParticipantRole = getHighestParticipantRole(
        this.user.roles,
      );

      this.newTopApplicationRole = this.currentTopApplicationRole;
      this.newTopParticipantRole = this.currentTopParticipantRole;
    }
  }

  getAvailableApplicationRoles(ownerUserRoles: string[]): string[] {
    if (ownerUserRoles.includes('AUTHORITY_ADMIN')) {
      return [
        'AUTHORITY_ADMIN',
        'AUTHORITY_USER',
        'SERVICE_PARTNER_ADMIN',
        'OPERATOR_ADMIN',
      ];
    } else if (ownerUserRoles.includes('SERVICE_PARTNER_ADMIN')) {
      return ['SERVICE_PARTNER_ADMIN'];
    } else if (ownerUserRoles.includes('OPERATOR_ADMIN')) {
      return ['OPERATOR_ADMIN'];
    } else {
      return [];
    }
  }

  setUpUpdatePermittedRoles(
    pageType: 'AUTHORITY_VIEW' | 'INTERNAL_VIEW' | 'OWN',
  ) {
    switch (pageType) {
      case 'AUTHORITY_VIEW':
        this.updatePermittedRoles = ['AUTHORITY_ADMIN'];
        break;
      case 'INTERNAL_VIEW':
        this.updatePermittedRoles = ['ADMIN'];
        break;
      case 'OWN':
        this.updatePermittedRoles = ['USER'];
        break;
    }
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
    this.isUpdateRoleActive = true;

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
    this.isUpdateRoleActive = false;

    // Same Organization
    if (this.sameOrganization) {
      if (
        this.newTopParticipantRole &&
        this.newTopParticipantRole !== this.currentTopParticipantRole
      ) {
        if (this.type === 'INTERNAL_VIEW') {
          this.store.dispatch(
            new UpdateUserParticipantRole(
              this.userId,
              this.newTopParticipantRole,
            ),
          );
        }
        if (this.type === 'AUTHORITY_VIEW') {
          this.store.dispatch(
            new UpdateUserParticipantRoleAsAuthority(
              this.userId,
              this.newTopParticipantRole,
            ),
          );
        }
      }

      if (
        this.newTopApplicationRole &&
        this.newTopApplicationRole !== this.currentTopApplicationRole &&
        this.newTopApplicationRole !== null
      ) {
        if (this.type === 'INTERNAL_VIEW') {
          this.store.dispatch(
            new UpdateUserApplicationRole(
              this.userId,
              this.newTopApplicationRole as UserRoleDto,
            ),
          );
        }

        if (this.type === 'AUTHORITY_VIEW') {
          this.store.dispatch(
            new UpdateUserApplicationRoleAsAuthority(
              this.userId,
              this.newTopApplicationRole as UserRoleDto,
            ),
          );
        }
      }
    }

    // Another Organization
    if (!this.sameOrganization) {
      if (
        this.newTopApplicationRole &&
        this.newTopApplicationRole !== this.currentTopApplicationRole &&
        this.newTopApplicationRole !== null
      ) {
        this.store.dispatch(
          new UpdateUserApplicationRoleAsAuthority(
            this.userId,
            this.newTopApplicationRole as UserRoleDto,
          ),
        );
      }
    }

    if (this.newTopApplicationRole === null) {
      if (this.type === 'INTERNAL_VIEW') {
        this.store.dispatch(new ClearUserApplicationRole(this.userId));
      }
      if (this.type === 'AUTHORITY_VIEW') {
        this.store.dispatch(
          new ClearUserApplicationRoleAsAuthority(this.userId),
        );
      }
      return;
    }
  }

  /**
   * To update user status
   * @param type REACTIVATE | DEACTIVATE
   */
  updateUserStatus(type: 'REACTIVATE' | 'DEACTIVATE') {
    this.userAction.emit({type});
  }
}
