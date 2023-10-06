import {UserInfo, UserRoleDto} from '@sovity.de/authority-portal-client';
import {E2eDevUser} from 'src/app/common/components/dev-utils/e2e-dev-user-switcher/e2e-dev-user';
import {Fetched} from '../utils/fetched';
import {AuthorityPortalPageSet} from './routes/authority-portal-page-set';

export interface GlobalState {
  pageSet: AuthorityPortalPageSet;
  userInfo: Fetched<UserInfo>;
  roles: Set<UserRoleDto>;

  e2eDevUser: E2eDevUser | null;
}

export const INITIAL_GLOBAL_STATE_MODEL: GlobalState = {
  pageSet: 'LOADING',
  userInfo: Fetched.empty(),
  roles: new Set(),
  e2eDevUser: null,
};
