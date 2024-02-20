import {ValidatorFn} from '@angular/forms';
import {namedRegexValidator} from './named-regex-validator';

export const validPhoneNumberPattern = /^\+?(?:[0-9] ?){4,19}[0-9]$/;

export const phoneNumberValidator: ValidatorFn = namedRegexValidator(
  validPhoneNumberPattern,
  'phoneNumber',
);
