import {UserDetailDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface UserProfilePageState {
  userId: string;
  user: Fetched<UserDetailDto>;
  busy: boolean;
}

export const DEFAULT_USER_PROFILE_PAGE_STATE: UserProfilePageState = {
  userId: '',
  user: Fetched.empty(),
  busy: false,
};
