import {ValidatorFn, Validators} from '@angular/forms';

export const validCertificatePattern =
  /^(-----BEGIN CERTIFICATE-----)[\s\S]*?(-----END CERTIFICATE-----)\s*$/m;

/**
 * Validates whether control's value is a valid certificate.
 * @param control control
 */
export const certificateValidator: ValidatorFn = Validators.pattern(
  validCertificatePattern,
);
