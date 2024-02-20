import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const namedRegexValidator =
  (regex: RegExp, key: string): ValidatorFn =>
  (c: AbstractControl): ValidationErrors | null => {
    if (!c.value) {
      return null;
    }
    return regex.test(c.value) ? null : {[key]: true};
  };
