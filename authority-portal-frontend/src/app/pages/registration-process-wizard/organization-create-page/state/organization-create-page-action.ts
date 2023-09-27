const tag = 'OrganizationCreatePage';

export class CreateOrganization {
  static readonly type = `[${tag}] Create Organization`;
  constructor(public formValue: any) {}
}
