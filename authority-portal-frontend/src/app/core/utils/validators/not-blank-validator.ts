import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function notBlankValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    if (control.value.length && control.dirty && control.value.trim() === '') {
      return {trimmedBlank: true};
    }
    return null;
  };
}
