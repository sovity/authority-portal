import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface OrganizationOnboardPageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
  organization: Fetched<OwnOrganizationDetailsDto>;
}

export const DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE: OrganizationOnboardPageState =
  {
    state: 'editing',
    organization: Fetched.empty(),
  };
