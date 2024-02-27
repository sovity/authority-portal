import {InviteParticipantUserRequest} from '@sovity.de/authority-portal-client';

const tag = 'ParticipantInviteNewUserPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
}

export class InviteNewUser {
  static readonly type = `[${tag}] Invite New User`;
  constructor(
    public request: InviteParticipantUserRequest,
    public enableForm: () => void,
    public disableForm: () => void,
    public success: () => void,
  ) {}
}
