import {ValidatorFn} from '@angular/forms';
import {namedRegexValidator} from './named-regex-validator';

export const validZipCodePattern = /^[a-z0-9][a-z0-9\- ]{3,10}[a-z0-9]$/;

export const zipCodeValidator: ValidatorFn = namedRegexValidator(
  validZipCodePattern,
  'zipCode',
);
