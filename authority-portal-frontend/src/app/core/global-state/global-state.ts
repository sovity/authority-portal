import {UserInfo, UserInfoRolesEnum} from '@sovity.de/authority-portal-client';
import {Fetched} from '../utils/fetched';
import {AuthorityPortalPageSet} from './routes/authority-portal-page-set';

export interface GlobalState {
  pageSet: AuthorityPortalPageSet;
  userInfo: Fetched<UserInfo>;
  roles: Set<UserInfoRolesEnum>;
}

export const INITIAL_GLOBAL_STATE_MODEL: GlobalState = {
  pageSet: 'LOADING',
  userInfo: Fetched.empty(),
  roles: new Set(),
};
