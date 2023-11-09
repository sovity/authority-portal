import {UserRoleDto} from '@sovity.de/authority-portal-client';

const tag = 'AuthorityOrganizationUserDetailPage';

export class SetOrganizationUserId {
  static readonly type = `[${tag}] Set Organization User Id`;
  constructor(public organizationMdsId: string, public userId: string) {}
}

export class RefreshOrganizationUser {
  static readonly type = `[${tag}] Refresh Organization User`;
}

export class UpdateUserRoles {
  static readonly type = `[${tag}] Update Organization User's Roles`;
  request: any;
  constructor(public userId: string, public roles: UserRoleDto) {}
}

export class UpdateAuthorityUserRoles {
  static readonly type = `[${tag}] Update Authority User's Roles`;
  request: any;
  constructor(public userId: string, public roles: UserRoleDto) {}
}

export class DeactivateUser {
  static readonly type = `[${tag}] Deactivate User`;
  constructor(public userId: string) {}
}

export class ReactivateUser {
  static readonly type = `[${tag}] Reactivate User`;
  constructor(public userId: string) {}
}
