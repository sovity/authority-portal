import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {phoneNumberValidator} from '../../../../core/utils/validators/phone-number-validator';
import {
  UserOnboardFormModel,
  UserOnboardFormValue,
} from './user-onboard-form-model';

export const buildUserOnboardForm = (
  formBuilder: FormBuilder,
  initialUser: UserOnboardFormValue,
): FormGroup<UserOnboardFormModel> => {
  return formBuilder.nonNullable.group({
    firstName: [initialUser.firstName, [Validators.required]],
    lastName: [initialUser.lastName, [Validators.required]],
    jobTitle: [initialUser.jobTitle, [Validators.required]],
    phoneNumber: [
      initialUser.phoneNumber,
      [Validators.required, phoneNumberValidator],
    ],
  });
};
