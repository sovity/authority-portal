import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function notBlankValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log(
      control.value.length,
      control.dirty,
      control.value.trim() === '',
    );
    if (control.value.length && control.dirty && control.value.trim() === '') {
      return {trimmedBlank: true};
    }
    return null;
  };
}
