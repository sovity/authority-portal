import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  ContactsProfileCreateFormValue,
  OrganizationProfileCreateFormValue,
  UserProfileCreateFormValue,
} from '../onboarding-process-wizard/onboarding-process-wizard.model';

export interface OrganizationRegistrationPageParentForm {
  userProfile: UserProfileCreateFormValue;
  organizationProfile?: OrganizationProfileCreateFormValue;
  mainContactProfile?: ContactsProfileCreateFormValue;
  technicalContactProfile?: ContactsProfileCreateFormValue;
}

export interface OnboardingProcessWizardPageState {
  onboardingFormState: 'editing' | 'submitting' | 'success' | 'error';
  organization: Fetched<OwnOrganizationDetailsDto>;
}

export const DEFAULT_ONBOARDING_PROCESS_WIZARD_PAGE_STATE: OnboardingProcessWizardPageState =
  {
    onboardingFormState: 'editing',
    organization: Fetched.empty(),
  };
