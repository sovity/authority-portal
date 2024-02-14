const tag = 'AuthorityOrganizationListPage';

export class RefreshOrganizations {
  static readonly type = `[${tag}] Refresh Organizations`;
}

export class ShowOrganizationDetail {
  static readonly type = `[${tag}]  Show Organization Details Slider`;
}

export class CloseOrganizationDetail {
  static readonly type = `[${tag}]  Close Organization Details Slider`;
}
