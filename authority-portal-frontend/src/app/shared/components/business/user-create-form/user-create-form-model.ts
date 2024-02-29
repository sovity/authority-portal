import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export interface UserCreateFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  jobTitle: FormControl<string>;
  phoneNumber: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export type UserCreateFormValue = ɵFormGroupRawValue<UserCreateFormModel>;

export const DEFAULT_USER_CREATE_FORM_MODEL: UserCreateFormValue = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
};
