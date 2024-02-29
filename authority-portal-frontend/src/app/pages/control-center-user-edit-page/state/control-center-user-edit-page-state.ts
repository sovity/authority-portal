import {
  OwnOrganizationDetailsDto,
  UserDetailDto,
} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';
import {HeaderBarConfig} from '../../../shared/components/common/header-bar/header-bar.model';

export interface ControlCenterUserEditPageState {
  user: Fetched<UserDetailDto>;
  headerBarConfig: HeaderBarConfig | null;
  busy: boolean;
}

export const DEFAULT_CONTROL_CENTER_USER_EDIT_PAGE_STATE: ControlCenterUserEditPageState =
  {
    user: Fetched.empty(),
    headerBarConfig: null,
    busy: false,
  };
