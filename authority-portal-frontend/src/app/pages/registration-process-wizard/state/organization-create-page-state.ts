import {
  ContactsProfileCreateFormValue,
  OrganizationProfileCreateFormValue,
  UserProfileCreateFormValue,
} from '../sub-pages/organization-create-page/organization-create-page-form-model';

export interface OrganizationRegistrationPageParentForm {
  userProfile: UserProfileCreateFormValue;
  organizationProfile: OrganizationProfileCreateFormValue;
  mainContactProfile: ContactsProfileCreateFormValue;
  technicalContactProfile: ContactsProfileCreateFormValue;
}

export interface OrganizationRegistrationPageState {
  id: string;
  email: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE: OrganizationRegistrationPageState =
  {
    id: '',
    email: '',
    state: 'editing',
  };
