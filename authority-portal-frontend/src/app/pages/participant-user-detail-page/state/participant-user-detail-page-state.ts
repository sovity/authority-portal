import {UserDetailDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface ParticipantUserDetailPageState {
  userId: string;
  organizationMdsId: string;
  user: Fetched<UserDetailDto>;
  busy: boolean;
  userParticipantRolesForm: {
    state: 'editing' | 'submitting' | 'success' | 'error';
    errors: {[key: string]: string};
  };
  userApplicationRolesForm: {
    state: 'editing' | 'submitting' | 'success' | 'error';
    errors: {[key: string]: string};
  };
}

export const DEFAULT_PARTICIPANT_USER_DETAIL_PAGE_STATE: ParticipantUserDetailPageState =
  {
    userId: '',
    organizationMdsId: '',
    user: Fetched.empty(),
    busy: false,
    userParticipantRolesForm: {state: 'editing', errors: {}},
    userApplicationRolesForm: {state: 'editing', errors: {}},
  };
