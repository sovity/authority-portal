import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type ParticipantInviteNewUserPageFormValue =
  ɵFormGroupRawValue<ParticipantInviteNewUserPageFormModel>;

export interface ParticipantInviteNewUserPageFormModel {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  role: FormControl<string>;
}

export const DEFAULT_PARTICIPANT_INVITE_NEW_USER_FORM_VALUE: ParticipantInviteNewUserPageFormValue =
  {
    email: '',
    firstName: '',
    lastName: '',
    role: '',
  };
