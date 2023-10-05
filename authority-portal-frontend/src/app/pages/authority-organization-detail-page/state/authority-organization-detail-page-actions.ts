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
