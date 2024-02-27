import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';
import {HeaderBarConfig} from '../../../shared/components/common/header-bar/header-bar.model';

export interface ControlCenterOrganizationMembersPageState {
  organization: Fetched<OwnOrganizationDetailsDto>;
  headerBarConfig: HeaderBarConfig | null;
}

export const DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBERS_PAGE_STATE: ControlCenterOrganizationMembersPageState =
  {
    organization: Fetched.empty(),
    headerBarConfig: null,
  };
