import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export interface UserEditFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  jobTitle: FormControl<string>;
  phoneNumber: FormControl<string>;
}

export type UserEditFormValue = ɵFormGroupRawValue<UserEditFormModel>;
