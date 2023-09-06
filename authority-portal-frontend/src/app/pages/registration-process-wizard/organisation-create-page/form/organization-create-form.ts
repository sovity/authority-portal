import {FormControl, ɵFormGroupValue} from '@angular/forms';

export interface OrganizationCreateForm {
  companyName: FormControl<string>;
  address: FormControl<string>;
  duns: FormControl<string>;
  url: FormControl<string>;
  securityEmail: FormControl<string>;
  authorizedCheck: FormControl<boolean>;
}

export type OrganizationCreateFormValue =
  ɵFormGroupValue<OrganizationCreateForm>;
