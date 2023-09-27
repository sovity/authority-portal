const tag = 'AuthorityOrganizationDetailPage';

export class RefreshOrganization {
  static readonly type = `[${tag}] Refresh Organization`;
  constructor(public mdsId: string) {}
}

export class ApproveOrganization {
  static readonly type = `[${tag}] Approve Organization`;
  constructor(public mdsId: string) {}
}

export class RejectOrganization {
  static readonly type = `[${tag}] Reject Organization`;
  constructor(public mdsId: string) {}
}
