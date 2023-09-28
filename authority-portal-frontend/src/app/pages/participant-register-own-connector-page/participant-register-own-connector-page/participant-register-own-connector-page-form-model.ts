import {FormControl, ɵFormGroupValue} from '@angular/forms';

export type ParticipantRegisterOwnConnectorPageFormValue =
  ɵFormGroupValue<ParticipantRegisterOwnConnectorPageFormModel>;

export interface ParticipantRegisterOwnConnectorPageFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  url: FormControl<string>;
  certificate: FormControl<string>;
}
