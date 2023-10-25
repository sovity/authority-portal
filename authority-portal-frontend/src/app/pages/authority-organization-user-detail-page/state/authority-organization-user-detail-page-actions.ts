const tag = 'AuthorityOrganizationUserDetailPage';

export class SetOrganizationUserId {
  static readonly type = `[${tag}] Set Organization User Id`;
  constructor(public organizationMdsId: string, public userId: string) {}
}

export class RefreshOrganizationUser {
  static readonly type = `[${tag}] Refresh Organization User`;
}
