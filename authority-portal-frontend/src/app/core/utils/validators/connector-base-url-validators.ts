import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validator function for checking the validity of a Connector Endpoint URL.
 * It checks if the URL is present and follows a specific pattern.
 * @returns Validator function to be used with Reactive Forms.
 */

export function connectorBaseUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // Define a regular expression pattern for a valid HTTPS URL.
    // Explanation of the pattern:
    // ^https:\/\/           - The URL must start with "https://".
    // [^\s\/]+              - Followed by one or more characters that are not whitespace or "/" (the domain).
    // (\.[^\s\/.]+)+        - Followed by one or more occurrences of a dot and more non-whitespace characters (subdomains and domain).
    // \/?$                  - Optionally ends with a forward slash ("/").
    const endpointUrlPattern = /^https:\/\/[^\s\/]+(\.[^\s\/.]+)+\/?$/;

    if (!endpointUrlPattern.test(control.value)) {
      return {invalidUrl: true};
    }

    return null;
  };
}