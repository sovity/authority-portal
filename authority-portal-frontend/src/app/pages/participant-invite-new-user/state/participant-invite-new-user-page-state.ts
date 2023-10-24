import {InviteParticipantUserRequest} from '@sovity.de/authority-portal-client';
import {
  NgxsFormState,
  initialFormState,
} from 'src/app/core/utils/ngxs-forms-utils';
import {DEFAULT_PARTICIPANT_INVITE_NEW_USER_FORM_VALUE} from '../participant-invite-new-user/participant-invite-new-user-page-form-model';

export interface ParticipantInviteNewUserPageState {
  participantInviteNewUserPageForm: NgxsFormState<InviteParticipantUserRequest>;
  id: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_PARTICIPANT_INVITE_NEW_USER_PAGE_STATE: ParticipantInviteNewUserPageState =
  {
    participantInviteNewUserPageForm: initialFormState(
      DEFAULT_PARTICIPANT_INVITE_NEW_USER_FORM_VALUE,
    ),
    id: '',
    state: 'editing',
  };
