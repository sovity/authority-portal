import {UserRoleDto} from '@sovity.de/authority-portal-client';

const tag = 'ParticipantUserDetailPage';

export class SetOrganizationUserId {
  static readonly type = `[${tag}] Set Organization User Id`;
  constructor(public organizationMdsId: string, public userId: string) {}
}

export class RefreshOrganizationUser {
  static readonly type = `[${tag}] Refresh Organization User`;
}

export class UpdateUserParticipantRole {
  static readonly type = `[${tag}] Update Internal User's Participant Role`;
  constructor(public userId: string, public role: UserRoleDto) {}
}

export class UpdateUserApplicationRole {
  static readonly type = `[${tag}] Update Internal User's Application Role`;
  constructor(public userId: string, public role: UserRoleDto) {}
}

export class ClearUserApplicationRole {
  static readonly type = `[${tag}] Clear User's Application Role`;
  constructor(public userId: string) {}
}

export class DeactivateUser {
  static readonly type = `[${tag}] Deactivate User`;
  constructor(public userId: string) {}
}

export class ReactivateUser {
  static readonly type = `[${tag}] Reactivate User`;
  constructor(public userId: string) {}
}
