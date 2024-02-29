import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {passwordEntropyValidator} from '../../../../core/utils/validators/password-entropy-validator';
import {passwordMatchValidator} from '../../../../core/utils/validators/password-match-validator';
import {phoneNumberValidator} from '../../../../core/utils/validators/phone-number-validator';
import {
  UserCreateFormModel,
  UserCreateFormValue,
} from './user-create-form-model';

export const buildUserCreateForm = (
  formBuilder: FormBuilder,
  initialUser: UserCreateFormValue,
): FormGroup<UserCreateFormModel> => {
  return formBuilder.nonNullable.group(
    {
      firstName: [initialUser.firstName, [Validators.required]],
      lastName: [initialUser.lastName, [Validators.required]],
      jobTitle: [initialUser.jobTitle, [Validators.required]],
      phoneNumber: [
        initialUser.phoneNumber,
        [Validators.required, phoneNumberValidator],
      ],
      email: [initialUser.email, [Validators.required, Validators.email]],
      password: [
        initialUser.password,
        [
          Validators.required,
          Validators.minLength(8),
          passwordEntropyValidator,
        ],
      ],
      confirmPassword: [initialUser.password, [Validators.required]],
    },
    {validators: passwordMatchValidator('password', 'confirmPassword')},
  );
};
