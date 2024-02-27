import {
  OwnOrganizationDetailsDto,
  UserDetailDto,
} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface OrganizationOnboardPageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
  details: Fetched<{
    user: UserDetailDto;
    organization: OwnOrganizationDetailsDto;
  }>;
  onboardingType: 'USER_ONBOARDING' | 'USER_ORGANIZATION_ONBOARDING';
}

export const DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE: OrganizationOnboardPageState =
  {
    state: 'editing',
    details: Fetched.empty(),
    onboardingType: 'USER_ONBOARDING',
  };
