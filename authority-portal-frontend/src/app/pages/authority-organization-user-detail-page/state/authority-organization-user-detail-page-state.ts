import {UserDetailDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface AuthorityOrganizationUserDetailPageState {
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

export const DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_PAGE_STATE: AuthorityOrganizationUserDetailPageState =
  {
    userId: '',
    organizationMdsId: '',
    user: Fetched.empty(),
    busy: false,
    userParticipantRolesForm: {state: 'editing', errors: {}},
    userApplicationRolesForm: {state: 'editing', errors: {}},
  };
