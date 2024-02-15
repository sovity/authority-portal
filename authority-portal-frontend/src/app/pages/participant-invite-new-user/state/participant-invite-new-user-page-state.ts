export interface ParticipantInviteNewUserPageState {
  id: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_PARTICIPANT_INVITE_NEW_USER_PAGE_STATE: ParticipantInviteNewUserPageState =
  {
    id: '',
    state: 'editing',
  };
