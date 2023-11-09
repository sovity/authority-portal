const tag = 'ParticipantUserDetailPage';

export class SetOrganizationUserId {
  static readonly type = `[${tag}] Set Organization User Id`;
  constructor(public organizationMdsId: string, public userId: string) {}
}

export class RefreshOrganizationUser {
  static readonly type = `[${tag}] Refresh Organization User`;
}

export class DeactivateUser {
  static readonly type = `[${tag}] Deactivate User`;
  constructor(public userId: string) {}
}

export class ReactivateUser {
  static readonly type = `[${tag}] Reactivate User`;
  constructor(public userId: string) {}
}
