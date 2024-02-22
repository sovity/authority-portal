import {RegistrationRequestDto} from '@sovity.de/authority-portal-client';

const tag = 'OrganizationCreatePage';

export class CreateOrganization {
  static readonly type = `[${tag}] Create Organization`;
  constructor(
    public request: RegistrationRequestDto,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}

export class Reset {
  static readonly type = `[${tag}] Reset`;
}
