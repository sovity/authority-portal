import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type ParticipantRegisterOwnConnectorPageFormValue =
  ɵFormGroupRawValue<ParticipantRegisterOwnConnectorPageFormModel>;

export interface ParticipantRegisterOwnConnectorPageFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  url: FormControl<string>;
  certificate: FormControl<string>;
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE: ParticipantRegisterOwnConnectorPageFormValue =
  {
    name: '',
    location: '',
    url: '',
    certificate: '',
  };
