import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {
  DEFAULT_ORGANIZATION_CREATE_FORM_MODEL,
  OrganizationCreateFormModel,
} from '../../../../shared/components/business/organization-create-form/organization-create-form-model';

export interface OnboardingUserTabFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  jobTitle: FormControl<string>;
  phoneNumber: FormControl<string>;
  acceptedTos: FormControl<boolean>;
}

export type OnboardingUserTabFormValue =
  ɵFormGroupRawValue<OnboardingUserTabFormModel>;

export const DEFAULT_ONBOARDING_USER_TAB_FORM_VALUE: OnboardingUserTabFormValue =
  {
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
    acceptedTos: false,
  };

export interface OnboardingOrganizationTabFormModel
  extends OrganizationCreateFormModel {
  acceptedTos: FormControl<boolean>;
}

export type OnboardingOrganizationTabFormValue =
  ɵFormGroupRawValue<OnboardingOrganizationTabFormModel>;

export const DEFAULT_ONBOARDING_ORGANIZATION_TAB_FORM_VALUE: OnboardingOrganizationTabFormValue =
  {
    ...DEFAULT_ORGANIZATION_CREATE_FORM_MODEL,
    acceptedTos: false,
  };

export interface OnboardingWizardFormModel {
  isEditable: FormControl<boolean>;
  userTab: FormGroup<OnboardingUserTabFormModel>;
  organizationTab: FormGroup<OnboardingOrganizationTabFormModel>;
}

export type OnboardingWizardFormValue =
  ɵFormGroupRawValue<OnboardingWizardFormModel>;

export const DEFAULT_ONBOARDING_WIZARD_FORM_VALUE: OnboardingWizardFormValue = {
  isEditable: true,
  userTab: DEFAULT_ONBOARDING_USER_TAB_FORM_VALUE,
  organizationTab: DEFAULT_ONBOARDING_ORGANIZATION_TAB_FORM_VALUE,
};
