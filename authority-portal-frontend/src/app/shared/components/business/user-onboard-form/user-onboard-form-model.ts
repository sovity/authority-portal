import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export interface UserOnboardFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  jobTitle: FormControl<string>;
  phoneNumber: FormControl<string>;
}

export type UserOnboardFormValue = ɵFormGroupRawValue<UserOnboardFormModel>;
