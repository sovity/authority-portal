import {InviteOrganizationRequest} from '@sovity.de/authority-portal-client';

const tag = 'AuthorityInviteNewOrganizationPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
}

export class InviteNewOrganization {
  static readonly type = `[${tag}] Invite New Organization`;
  constructor(
    public request: InviteOrganizationRequest,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}
