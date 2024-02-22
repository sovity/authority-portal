import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface OrganizationOnboardPageState {
  onboardingFormState: 'editing' | 'submitting' | 'success' | 'error';
  organization: Fetched<OwnOrganizationDetailsDto>;
}

export const DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE: OrganizationOnboardPageState =
  {
    onboardingFormState: 'editing',
    organization: Fetched.empty(),
  };
