import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export interface CertificateFormModel {
  bringOwnCert: FormControl<boolean>;
  ownCertificate: FormControl<string>;

  organizationalUnit: FormControl<string>;
  email: FormControl<string>;
  state: FormControl<string>;
  city: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  generatedCertificate: FormControl<string>;
}

export type CertificateFormValue = ɵFormGroupRawValue<CertificateFormModel>;

export const DEFAULT_CERTIFICATE_FORM_VALUE: CertificateFormValue = {
  bringOwnCert: false,
  ownCertificate: '',
  organizationalUnit: '',
  email: '',
  state: '',
  city: '',
  password: '',
  confirmPassword: '',
  generatedCertificate: '',
};
