import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validator function for checking the validity of a URL.
 * It checks if the URL is present and follows a specific pattern.
 * @returns Validator function to be used with Reactive Forms.
 */
export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // Define a regular expression pattern for a valid HTTP or HTTPS URL.
    // Explanation of the pattern:
    // ^(http|https):\/\/   - The URL must start with "http://" or "https://".
    // [^ "]+               - Followed by one or more characters that are not space or ".
    const urlPattern = /^(http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(control.value)) {
      return {invalidUrl: true};
    }

    return null;
  };
}
