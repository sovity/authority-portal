import {InviteParticipantUserRequest} from '@sovity.de/authority-portal-client';
import {DEFAULT_PARTICIPANT_INVITE_NEW_USER_FORM_VALUE} from '../participant-invite-new-user/participant-invite-new-user.model';

export interface ParticipantInviteNewUserPageState {
  id: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_PARTICIPANT_INVITE_NEW_USER_PAGE_STATE: ParticipantInviteNewUserPageState =
  {
    id: '',
    state: 'editing',
  };
