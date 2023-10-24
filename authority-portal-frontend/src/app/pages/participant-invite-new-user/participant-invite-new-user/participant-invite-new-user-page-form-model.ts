import {FormControl, ɵFormGroupRawValue} from '@angular/forms';
import {UserRoleDto} from '@sovity.de/authority-portal-client';

export type ParticipantInviteNewUserPageFormValue =
  ɵFormGroupRawValue<ParticipantInviteNewUserPageFormModel>;

export interface ParticipantInviteNewUserPageFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<UserRoleDto>;
}

export const DEFAULT_PARTICIPANT_INVITE_NEW_USER_FORM_VALUE: ParticipantInviteNewUserPageFormValue =
  {
    firstName: '',
    lastName: '',
    email: '',
    role: 'PARTICIPANT_USER' as UserRoleDto,
  };
