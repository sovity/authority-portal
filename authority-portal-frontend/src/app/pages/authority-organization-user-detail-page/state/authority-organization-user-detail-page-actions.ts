import {UserRoleDto} from '@sovity.de/authority-portal-client';

const tag = 'AuthorityOrganizationUserDetailPage';

export class SetOrganizationUserId {
  static readonly type = `[${tag}] Set Organization User Id`;
  constructor(public organizationMdsId: string, public userId: string) {}
}

export class RefreshOrganizationUser {
  static readonly type = `[${tag}] Refresh Organization User`;
}

export class UpdateUserParticipantRoleAsAuthority {
  static readonly type = `[${tag}] Update User's Participant Role as Authority`;
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
  static readonly type = `[${tag}] Deactivate User`;
  constructor(public userId: string) {}
}

export class ReactivateUser {
  static readonly type = `[${tag}] Reactivate User`;
  constructor(public userId: string) {}
}
