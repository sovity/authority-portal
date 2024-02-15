import {ValidatorFn, Validators} from '@angular/forms';

export const validPhoneNumberPattern = /^\d{11}$/;

export const phoneNumberValidator: ValidatorFn = Validators.pattern(
  validPhoneNumberPattern,
);
