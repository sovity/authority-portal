const tag = 'ParticipantOrganizationProfilePage';

export class SetOrganizationMdsId {
  static readonly type = `[${tag}] Set Organization Mds Id`;
  constructor(public organizationMdsId: string) {}
}

export class RefreshOrganization {
  static readonly type = `[${tag}] Refresh Organization`;
}
