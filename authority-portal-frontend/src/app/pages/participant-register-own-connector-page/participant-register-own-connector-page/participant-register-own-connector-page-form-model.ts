import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';

export interface ParticipantRegisterOwnConnectorPageFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  frontendUrl: FormControl<string>;
  endpointUrl: FormControl<string>;
  managementUrl: FormControl<string>;
}

export interface CertificateFormModel {
  certificate: FormControl<string>;
}

export interface RegisterConnectorParentFormGroup {
  connectorDetails: FormGroup<ParticipantRegisterOwnConnectorPageFormModel>;
  certificate: FormGroup<CertificateFormModel>;
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE: ParticipantRegisterOwnConnectorPageFormValue =
  {
    name: '',
    location: '',
    frontendUrl: '',
    endpointUrl: '',
    managementUrl: '',
  };

export const DEFAULT_CERTIFICATE_FORM_VALUE: CertificateFormModelValue = {
  certificate: '',
};

export type CertificateFormModelValue =
  ɵFormGroupRawValue<CertificateFormModel>;

export type ParticipantRegisterOwnConnectorPageFormValue =
  ɵFormGroupRawValue<ParticipantRegisterOwnConnectorPageFormModel>;

export interface ParticipantRegisterOwnConnectorPageParentForm {
  connectorDetails: ParticipantRegisterOwnConnectorPageFormValue;
  certificate: CertificateFormModelValue;
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_PARENT_FORM_VALUE: ParticipantRegisterOwnConnectorPageParentForm =
  {
    connectorDetails: DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE,
    certificate: DEFAULT_CERTIFICATE_FORM_VALUE,
  };

export interface PredefinedCertificateValues {
  country: string;
  organizationalName: string;
  commonName: string;
}
