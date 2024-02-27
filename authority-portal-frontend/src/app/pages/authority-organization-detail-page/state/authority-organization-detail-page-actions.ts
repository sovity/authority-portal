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

export class DeactivateUser {
  static readonly type = `[${tag}] Deactivate Currently Opened Organization User`;
  constructor(public userId: string) {}
}

export class ReactivateUser {
  static readonly type = `[${tag}] Reactivate Currently Opened Organization User`;
  constructor(public userId: string) {}
}
