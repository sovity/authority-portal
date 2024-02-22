import {UserRoleDto} from '@sovity.de/authority-portal-client';

const tag = 'AuthorityOrganizationDetailPage';

export class SetOrganizationMdsId {
  static readonly type = `[${tag}] Set Organization Mds Id`;
  constructor(public organizationMdsId: string) {}
}

export class RefreshOrganization {
  static readonly type = `[${tag}] Refresh Organization`;
}

export class ApproveOrganization {
  static readonly type = `[${tag}] Approve Organization`;
}

export class RejectOrganization {
  static readonly type = `[${tag}] Reject Organization`;
}

// Opened User detail Actions

export class SetOrganizationUserId {
  static readonly type = `[${tag}] Set Currently Opened Organization User Id`;
  constructor(public organizationMdsId: string, public userId: string) {}
}

export class RefreshOrganizationUser {
  static readonly type = `[${tag}] Refresh Currently Opened Organization User`;
}
export class UpdateUserParticipantRole {
  static readonly type = `[${tag}] Update User's Participant Role`;
  constructor(public userId: string, public role: UserRoleDto) {}
}

export class UpdateUserApplicationRoleAsAuthority {
  static readonly type = `[${tag}] Update User's Application Role as Authority`;
  constructor(public userId: string, public role: UserRoleDto) {}
}

export class ClearUserApplicationRoleAsAuthority {
  static readonly type = `[${tag}] Remove User's Application Role as Authority`;
  constructor(public userId: string) {}
}

export class DeactivateUser {
  static readonly type = `[${tag}] Deactivate Currently Opened Organization User`;
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

export class ReactivateUser {
  static readonly type = `[${tag}] Reactivate Currently Opened Organization User`;
  constructor(public userId: string) {}
}
