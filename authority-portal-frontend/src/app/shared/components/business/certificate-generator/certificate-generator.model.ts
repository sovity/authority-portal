import {FormControl} from '@angular/forms';

export interface PreDefinedCertificateDetails {
  country: string;
  organizationalName: string;
  commonName: string;
}

export interface CertificateDetailsFormModel {
  organizationalName: FormControl<string>;
  organizationalUnit: FormControl<string>;
  email: FormControl<string>;
  country: FormControl<string>;
  state: FormControl<string>;
  city: FormControl<string>;
  commonName: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}
