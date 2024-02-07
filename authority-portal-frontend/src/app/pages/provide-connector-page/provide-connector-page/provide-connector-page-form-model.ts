import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';

export interface ProvideConnectorPageFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  frontendUrl: FormControl<string>;
  endpointUrl: FormControl<string>;
  managementUrl: FormControl<string>;
  mdsId: FormControl<string>;
}

export interface CertificateFormModel {
  certificate: FormControl<string>;
}

export interface ProvideConnectorParentFormGroup {
  connectorDetails: FormGroup<ProvideConnectorPageFormModel>;
  certificate: FormGroup<CertificateFormModel>;
}

export const DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE: ProvideConnectorPageFormValue =
  {
    name: '',
    location: '',
    frontendUrl: '',
    endpointUrl: '',
    managementUrl: '',
    mdsId: '',
  };

export const DEFAULT_CERTIFICATE_FORM_VALUE: CertificateFormModelValue = {
  certificate: '',
};

export type ProvideConnectorPageFormValue =
  ɵFormGroupRawValue<ProvideConnectorPageFormModel>;

export type CertificateFormModelValue =
  ɵFormGroupRawValue<CertificateFormModel>;

export interface ProvideConnectorPageParentForm {
  connectorDetails: ProvideConnectorPageFormValue;
  certificate: CertificateFormModelValue;
}

export const DEFAULT_PROVIDE_CONNECTOR_PARENT_FORM_VALUE: ProvideConnectorPageParentForm =
  {
    connectorDetails: DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE,
    certificate: DEFAULT_CERTIFICATE_FORM_VALUE,
  };

export interface PredefinedCertificateValues {
  country: string;
  organizationalName: string;
  commonName: string;
}
