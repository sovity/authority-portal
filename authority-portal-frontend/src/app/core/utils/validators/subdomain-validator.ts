import {ValidatorFn, Validators} from '@angular/forms';

/**
 * Validator function for checking the validity of a subdomain.
 * @returns Validator function to be used with Reactive Forms.
 */
export const subdomainValidators: ValidatorFn[] = [
  Validators.pattern(/^[a-z][a-z\d-]+[a-z\d]$/),
  Validators.minLength(6),
  Validators.maxLength(23),
];
