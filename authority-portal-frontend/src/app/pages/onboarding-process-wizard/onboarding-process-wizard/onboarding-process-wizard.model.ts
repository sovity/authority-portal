import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {
  DEFAULT_ORGANIZATION_PROFILE_FORM_MODEL,
  OrganizationProfileFormModel,
} from '../../../shared/components/business/organization-profile-form/organization-profile-form-model';

export interface OnboardingUserTabFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  jobTitle: FormControl<string>;
  phoneNumber: FormControl<string>;
}

export type OnboardingUserTabFormValue =
  ɵFormGroupRawValue<OnboardingUserTabFormModel>;

export const DEFAULT_ONBOARDING_USER_TAB_FORM_VALUE: OnboardingUserTabFormValue =
  {
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
  };

export interface OnboardingOrganizationTabFormModel
  extends OrganizationProfileFormModel {
  acceptedTos: FormControl<boolean>;
}

export type OnboardingOrganizationTabFormValue =
  ɵFormGroupRawValue<OnboardingOrganizationTabFormModel>;

export const DEFAULT_ONBOARDING_ORGANIZATION_TAB_FORM_VALUE: OnboardingOrganizationTabFormValue =
  {
    ...DEFAULT_ORGANIZATION_PROFILE_FORM_MODEL,
    acceptedTos: false,
  };

export interface OnboardingWizardFormModel {
  userTab: FormGroup<OnboardingUserTabFormModel>;
  organizationTab: FormGroup<OnboardingOrganizationTabFormModel>;
}

export type OnboardingWizardFormValue =
  ɵFormGroupRawValue<OnboardingWizardFormModel>;

export const DEFAULT_ONBOARDING_WIZARD_FORM_VALUE: OnboardingWizardFormValue = {
  userTab: DEFAULT_ONBOARDING_USER_TAB_FORM_VALUE,
  organizationTab: DEFAULT_ONBOARDING_ORGANIZATION_TAB_FORM_VALUE,
};
