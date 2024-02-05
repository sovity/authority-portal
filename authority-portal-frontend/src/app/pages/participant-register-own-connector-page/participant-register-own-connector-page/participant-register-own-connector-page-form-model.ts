import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type ParticipantRegisterOwnConnectorPageFormValue =
  ɵFormGroupRawValue<ParticipantRegisterOwnConnectorPageFormModel>;

export interface ParticipantRegisterOwnConnectorPageFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  frontendUrl: FormControl<string>;
  endpointUrl: FormControl<string>;
  managementUrl: FormControl<string>;
  certificate: FormControl<string>;
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE: ParticipantRegisterOwnConnectorPageFormValue =
  {
    name: '',
    location: '',
    frontendUrl: '',
    endpointUrl: '',
    managementUrl: '',
    certificate: '',
  };

export type GenerateCertificateFormValue =
  ɵFormGroupRawValue<GenerateCertificateFormModel>;

export interface GenerateCertificateFormModel {
  country: FormControl<string>;
  state: FormControl<string>;
  city: FormControl<string>;
  organizationalUnit: FormControl<string>;
  commonName: FormControl<string>;
  certificate: FormControl<string>;
}

export const DEFAULT_GENERATE_CERTIFICATE_FORM_VALUE: GenerateCertificateFormValue =
  {
    country: '',
    state: '',
    city: '',
    organizationalUnit: '',
    commonName: '',
    certificate: '',
  };

export interface ParticipantRegisterOwnConnectorPageParentForm {
  connectorDetails: ParticipantRegisterOwnConnectorPageFormValue;
  certificate: GenerateCertificateFormValue;
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_PARENT_FORM_VALUE: ParticipantRegisterOwnConnectorPageParentForm =
  {
    connectorDetails: DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE,
    certificate: DEFAULT_GENERATE_CERTIFICATE_FORM_VALUE,
  };
