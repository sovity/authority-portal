import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {phoneNumberValidator} from '../../../../core/utils/validators/phone-number-validator';
import {UserEditFormModel, UserEditFormValue} from './user-edit-form-model';

export const buildUserEditForm = (
  formBuilder: FormBuilder,
  initialUser: UserEditFormValue,
): FormGroup<UserEditFormModel> => {
  return formBuilder.nonNullable.group({
    firstName: [initialUser.firstName, [Validators.required]],
    lastName: [initialUser.lastName, [Validators.required]],
    email: [initialUser.email, [Validators.required, Validators.email]],
    jobTitle: [initialUser.jobTitle, [Validators.required]],
    phoneNumber: [
      initialUser.phoneNumber,
      [Validators.required, phoneNumberValidator],
    ],
  });
};
