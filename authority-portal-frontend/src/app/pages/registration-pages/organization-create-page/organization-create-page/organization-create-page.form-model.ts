import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {
  DEFAULT_ORGANIZATION_CREATE_FORM_MODEL,
  OrganizationCreateFormModel,
} from '../../../../shared/components/business/organization-create-form/organization-create-form-model';
import {
  DEFAULT_USER_CREATE_FORM_MODEL,
  UserCreateFormModel,
} from '../../../../shared/components/business/user-create-form/user-create-form-model';

export interface RegistrationUserTabFormModel extends UserCreateFormModel {}

export type RegistrationUserTabFormValue =
  ɵFormGroupRawValue<RegistrationUserTabFormModel>;

export interface RegistrationOrganizationTabFormModel
  extends OrganizationCreateFormModel {
  acceptedTos: FormControl<boolean>;
}

export type RegistrationOrganizationTabFormValue =
  ɵFormGroupRawValue<RegistrationOrganizationTabFormModel>;

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
    userTab: DEFAULT_USER_CREATE_FORM_MODEL,
    organizationTab: {
      ...DEFAULT_ORGANIZATION_CREATE_FORM_MODEL,
      acceptedTos: false,
    },
  };
