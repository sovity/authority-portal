import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export interface OrganizationEditFormModel {
  website: FormControl<string>;
  businessUnit: FormControl<string>;
  industry: FormControl<string | null>;
  description: FormControl<string>;

  mainAddress: FormControl<string>;

  billingAddressSameAsMain: FormControl<boolean>;
  billingAddress: FormControl<string>;

  mainContactName: FormControl<string>;
  mainContactPhoneNumber: FormControl<string>;
  mainContactEmail: FormControl<string>;

  technicalContactSameAsMain: FormControl<boolean>;
  technicalContactName: FormControl<string>;
  technicalContactPhoneNumber: FormControl<string>;
  technicalContactEmail: FormControl<string>;
}

export type OrganizationEditFormValue =
  ɵFormGroupRawValue<OrganizationEditFormModel>;
