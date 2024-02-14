import {UserDetailDto, UserRoleDto} from '@sovity.de/authority-portal-client';

export interface UserDetailConfig {
  userId: string;
  user: UserDetailDto;
  pageFor: 'AUTHORITY_VIEW' | 'INTERNAL_VIEW' | 'OWN';
}

export interface UserRolesManagement {
  allRoles: (UserRoleDto | null)[];
  userRoles: (UserRoleDto | null)[];
  updatedRole?: UserRoleDto | null;
}

export interface UserAction {
  type: 'REACTIVATE' | 'DEACTIVATE';
}

export interface UserRoleUpdate {
  type: UserRoleUpdateType;
  role: UserRoleDto | null;
}

export enum UserRoleUpdateType {
  APPLICATION = 'APPLICATION',
  PARTICIPANT = 'PARTICIPANT',
}
