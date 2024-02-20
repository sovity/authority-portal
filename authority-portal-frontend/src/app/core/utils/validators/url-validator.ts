import {ValidatorFn} from '@angular/forms';
import {namedRegexValidator} from './named-regex-validator';

const validUrlPattern = /^(http|https):\/\/[^ "]+$/;

// e.g. phone number validator
export const urlValidator: ValidatorFn = namedRegexValidator(
  validUrlPattern,
  'url',
);
