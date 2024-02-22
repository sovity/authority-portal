import {AbstractControl, ValidatorFn} from '@angular/forms';

export const passwordMatchValidator =
  (passwordCtrlPath: string, repeatCtrlPath: string): ValidatorFn =>
  (c: AbstractControl) => {
    const passwordCtrl = c.get(passwordCtrlPath);
    const repeatCtrl = c.get(repeatCtrlPath);
    if (passwordCtrl?.disabled || repeatCtrl?.disabled) {
      return null;
    }

    const password = passwordCtrl?.value;
    const confirmPassword = repeatCtrl?.value;
    return password === confirmPassword ? null : {mismatch: true};
  };
