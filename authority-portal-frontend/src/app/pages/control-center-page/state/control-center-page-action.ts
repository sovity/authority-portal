import {UserRoleDto} from '@sovity.de/authority-portal-client';

const tag = 'ControlCenterPage';

export class RefreshUserProfile {
  static readonly type = `[${tag}] Refresh User profile`;
  constructor(public userId: string) {}
}
export class SetOrganizationMdsId {
  static readonly type = `[${tag}] Set Organization Mds Id`;
  constructor(public organizationMdsId: string) {}
}

export class RefreshOrganization {
  static readonly type = `[${tag}] Refresh Organization`;
}

// Opened User detail Actions

export class SetMyOrganizationUserId {
  static readonly type = `[${tag}] Set Currently Opened Organization User Id`;
  constructor(public organizationMdsId: string, public userId: string) {}
}

export class ClearMyOrganizationUserId {
  static readonly type = `[${tag}] Clears Currently Opened Organization User Id`;
}

export class SetShowOrganizationUserDetailValue {
  static readonly type = `[${tag}] Show/Hide Currently Opened Organization's selected User Detail`;
  constructor(public show: boolean) {}
}

export class RefreshMyOrganizationUser {
  static readonly type = `[${tag}] Refresh Currently Opened Organization User`;
}

export class UpdateUserParticipantRole {
  static readonly type = `[${tag}] Update  Currently Opened Organization User's Participant Role`;
  constructor(public userId: string, public role: UserRoleDto) {}
}

export class UpdateUserApplicationRole {
  static readonly type = `[${tag}] Update  Currently Opened Organization User's Application Role`;
  constructor(public userId: string, public role: UserRoleDto) {}
}

export class ClearUserApplicationRole {
  static readonly type = `[${tag}] Clear User's Application Role`;
  constructor(public userId: string) {}
}

export class DeactivateUser {
  static readonly type = `[${tag}] Deactivate Currently Opened Organization User`;
  constructor(public userId: string) {}
}

export class ReactivateUser {
  static readonly type = `[${tag}] Reactivate Currently Opened Organization User`;
  constructor(public userId: string) {}
}

export class CheckDeleteUser {
  static readonly type = `[${tag}] Check Delete Info Of Currently Opened Organization User`;
  constructor(public userId: string) {}
}

export class DeleteUser {
  static readonly type = `[${tag}] Delete Currently Opened Organization User`;
  constructor(public userId: string, public successorId?: string) {}
}

export class UpdateUserDeletionModalVisibility {
  static readonly type = `[${tag}] Update User Deletion Modal Visibility`;
  constructor(public visible: boolean) {}
}
