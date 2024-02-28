import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {
  DEFAULT_ORGANIZATION_CREATE_FORM_MODEL,
  OrganizationCreateFormModel,
} from '../../../../shared/components/business/organization-create-form/organization-create-form-model';

export interface RegistrationUserTabFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  jobTitle: FormControl<string>;
  phoneNumber: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export type RegistrationUserTabFormValue =
  ɵFormGroupRawValue<RegistrationUserTabFormModel>;

export const DEFAULT_REGISTRATION_USER_TAB_FORM_VALUE: RegistrationUserTabFormValue =
  {
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

export interface RegistrationOrganizationTabFormModel
  extends OrganizationCreateFormModel {
  acceptedTos: FormControl<boolean>;
}

export type RegistrationOrganizationTabFormValue =
  ɵFormGroupRawValue<RegistrationOrganizationTabFormModel>;

export const DEFAULT_REGISTRATION_ORGANIZATION_TAB_FORM_VALUE: RegistrationOrganizationTabFormValue =
  {
    ...DEFAULT_ORGANIZATION_CREATE_FORM_MODEL,
    acceptedTos: false,
  };

export interface RegistrationWizardFormModel {
  isEditable: FormControl<boolean>;
  userTab: FormGroup<RegistrationUserTabFormModel>;
  organizationTab: FormGroup<RegistrationOrganizationTabFormModel>;
}

export type RegistrationWizardFormValue =
  ɵFormGroupRawValue<RegistrationWizardFormModel>;

export const DEFAULT_REGISTRATION_WIZARD_FORM_VALUE: RegistrationWizardFormValue =
  {
    isEditable: true,
    userTab: DEFAULT_REGISTRATION_USER_TAB_FORM_VALUE,
    organizationTab: DEFAULT_REGISTRATION_ORGANIZATION_TAB_FORM_VALUE,
  };
