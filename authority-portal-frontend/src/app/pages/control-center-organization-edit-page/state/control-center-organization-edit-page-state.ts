import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';
import {HeaderBarConfig} from '../../../shared/components/common/header-bar/header-bar.model';

export interface ControlCenterOrganizationEditPageState {
  organization: Fetched<OwnOrganizationDetailsDto>;
  headerBarConfig: HeaderBarConfig | null;
  busy: boolean;
}

export const DEFAULT_CONTROL_CENTER_ORGANIZATION_EDIT_PAGE_STATE: ControlCenterOrganizationEditPageState =
  {
    organization: Fetched.empty(),
    headerBarConfig: null,
    busy: false,
  };
