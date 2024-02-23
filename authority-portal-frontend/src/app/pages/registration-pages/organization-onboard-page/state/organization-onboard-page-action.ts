import {
  OnboardingOrganizationUpdateDto,
  OnboardingUserUpdateDto,
} from '@sovity.de/authority-portal-client';

const tag = 'OnboardingPage';

export interface OnboardingProcessRequest {
  userProfile: OnboardingUserUpdateDto;
  organizationProfile: OnboardingOrganizationUpdateDto;
}

export class OnboardingProcessFormSubmit {
  static readonly type = `[${tag}] Onboarding Form Submit`;
  constructor(
    public request: OnboardingProcessRequest,
    public enableForm: () => void,
    public disableForm: () => void,
    public success: () => void,
  ) {}
}

export class Reset {
  static readonly type = `[${tag}] Reset`;
}
