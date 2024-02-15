import {AbstractControl, ValidatorFn} from '@angular/forms';

export const passwordMatchValidator =
  (passwordCtrlPath: string, repeatCtrlPath: string): ValidatorFn =>
  (c: AbstractControl) => {
    const password = c.get(passwordCtrlPath)?.value;
    const confirmPassword = c.get(repeatCtrlPath)?.value;
    return password === confirmPassword ? null : {mismatch: true};
  };
