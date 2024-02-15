import {ValidatorFn, Validators} from '@angular/forms';

export const zipcodePattern = /^\d+$/;
export const zipcodeValidator: ValidatorFn = Validators.pattern(zipcodePattern);
