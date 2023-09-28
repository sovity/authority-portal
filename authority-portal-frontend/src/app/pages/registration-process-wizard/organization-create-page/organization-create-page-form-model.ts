import {FormControl, ɵFormGroupValue} from '@angular/forms';

export type OrganizationCreatePageFormValue =
  ɵFormGroupValue<OrganizationCreatePageFormModel>;

export interface OrganizationCreatePageFormModel {
  name: FormControl<string>;
  address: FormControl<string>;
  duns: FormControl<string>;
  url: FormControl<string>;
  securityEmail: FormControl<string>;
  authorizedCheck: FormControl<string>;
}
