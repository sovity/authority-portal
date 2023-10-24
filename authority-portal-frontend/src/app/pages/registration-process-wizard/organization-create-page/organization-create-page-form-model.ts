import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type OrganizationCreatePageFormValue =
  ɵFormGroupRawValue<OrganizationCreatePageFormModel>;

export interface OrganizationCreatePageFormModel {
  name: FormControl<string>;
  address: FormControl<string>;
  duns: FormControl<string>;
  url: FormControl<string>;
  securityEmail: FormControl<string>;
  authorizedCheck: FormControl<boolean>;
}

export const DEFAULT_ORGANIZATION_CREATE_FORM_VALUE: OrganizationCreatePageFormValue =
  {
    name: '',
    address: '',
    duns: '',
    url: '',
    securityEmail: '',
    authorizedCheck: false,
  };
