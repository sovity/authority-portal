import {ValidatorFn, Validators} from '@angular/forms';

export const passwordEntropyPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
export const passwordEntropyValidator: ValidatorFn = Validators.pattern(
  passwordEntropyPattern,
);
