import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface OnboardingProcessWizardPageState {
  onboardingFormState: 'editing' | 'submitting' | 'success' | 'error';
  organization: Fetched<OwnOrganizationDetailsDto>;
}

export const DEFAULT_ONBOARDING_PROCESS_WIZARD_PAGE_STATE: OnboardingProcessWizardPageState =
  {
    onboardingFormState: 'editing',
    organization: Fetched.empty(),
  };
