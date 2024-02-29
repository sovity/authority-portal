import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {OrganizationCreateFormModel} from '../../../../shared/components/business/organization-create-form/organization-create-form-model';
import {UserOnboardFormModel} from '../../../../shared/components/business/user-onboard-form/user-onboard-form-model';

export interface OnboardingUserTabFormModel extends UserOnboardFormModel {
  acceptedTos: FormControl<boolean>;
}

export type OnboardingUserTabFormValue =
  ɵFormGroupRawValue<OnboardingUserTabFormModel>;

export interface OnboardingOrganizationTabFormModel
  extends OrganizationCreateFormModel {
  acceptedTos: FormControl<boolean>;
}

export type OnboardingOrganizationTabFormValue =
  ɵFormGroupRawValue<OnboardingOrganizationTabFormModel>;

export interface OnboardingWizardFormModel {
  isEditable: FormControl<boolean>;
  userTab: FormGroup<OnboardingUserTabFormModel>;
  organizationTab: FormGroup<OnboardingOrganizationTabFormModel>;
}

export type OnboardingWizardFormValue =
  ɵFormGroupRawValue<OnboardingWizardFormModel>;
