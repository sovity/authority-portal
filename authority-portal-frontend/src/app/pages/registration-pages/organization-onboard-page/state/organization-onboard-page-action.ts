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
    public onboardingType: 'USER_ONBOARDING' | 'USER_ORGANIZATION_ONBOARDING',
    public request: OnboardingProcessRequest,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}

export class GetOnboardingOrganizationDetails {
  static readonly type = `[${tag}] Get Onboarding Organization Details`;
}

export class Reset {
  static readonly type = `[${tag}] Reset`;
}
