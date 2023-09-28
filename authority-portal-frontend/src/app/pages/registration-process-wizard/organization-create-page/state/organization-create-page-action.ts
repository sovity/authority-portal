import {CreateOrganizationRequest} from '@sovity.de/authority-portal-client';

const tag = 'OrganizationCreatePage';

export class CreateOrganization {
  static readonly type = `[${tag}] Create Organization`;
  constructor(
    public request: CreateOrganizationRequest,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}
