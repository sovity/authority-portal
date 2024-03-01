import {UserDetailDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';
import {UserDetailConfig} from '../../../shared/components/business/shared-user-detail/shared-user-detail.model';
import {HeaderBarConfig} from '../../../shared/components/common/header-bar/header-bar.model';

export interface ControlCenterUserProfilePageState {
  user: Fetched<UserDetailDto>;
  userDetailConfig: UserDetailConfig | null;
  headerBarConfig: HeaderBarConfig | null;
  busy: boolean;
}

export const DEFAULT_CONTROL_CENTER_USER_PROFILE_PAGE_STATE: ControlCenterUserProfilePageState =
  {
    user: Fetched.empty(),
    userDetailConfig: null,
    headerBarConfig: null,
    busy: false,
  };