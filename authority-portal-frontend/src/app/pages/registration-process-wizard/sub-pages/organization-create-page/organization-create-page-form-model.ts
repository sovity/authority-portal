import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {OrganizationLegalIdTypeDto} from '@sovity.de/authority-portal-client';

export interface UserProfileCreateFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  jobTitle: FormControl<string>;
  phoneNumber: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export interface OrganizationProfileCreateFormModel {
  legalName: FormControl<string>;
  website: FormControl<string>;
  businessUnit: FormControl<string>;
  address: FormGroup<AddressCreateFormModel>;
  billingAddress: FormGroup<AddressCreateFormModel>;
  description: FormControl<string>;
  legalIdType: FormControl<OrganizationLegalIdTypeDto>;
  legalId: FormControl<string>;
  commerceRegisterLocation: FormControl<string>;
}

export interface ContactsProfileCreateFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<string>;
  email: FormControl<string>;
}

export interface AddressCreateFormModel {
  street: FormControl<string>;
  city: FormControl<string>;
  houseNo: FormControl<string>;
  zipCode: FormControl<string>;
  country: FormControl<string>;
}

export interface OrganizationRegistrationPageParentFormModel {
  userProfile: FormGroup<UserProfileCreateFormModel>;
  organizationProfile: FormGroup<OrganizationProfileCreateFormModel>;
  mainContactProfile: FormGroup<ContactsProfileCreateFormModel>;
  technicalContactProfile: FormGroup<ContactsProfileCreateFormModel>;
  acceptedConditions: FormControl<boolean>;
}

export type UserProfileCreateFormValue =
  ɵFormGroupRawValue<UserProfileCreateFormModel>;

export type OrganizationProfileCreateFormValue =
  ɵFormGroupRawValue<OrganizationProfileCreateFormModel>;

export type ContactsProfileCreateFormValue =
  ɵFormGroupRawValue<ContactsProfileCreateFormModel>;

export type AddressCreateFormValue = ɵFormGroupRawValue<AddressCreateFormModel>;

export type OrganizationRegistrationPageParentFormValue =
  ɵFormGroupRawValue<OrganizationRegistrationPageParentFormModel>;

export const DEFAULT_ADDRESS_FORM_VALUE: AddressCreateFormValue = {
  street: '',
  city: '',
  houseNo: '',
  zipCode: '',
  country: '',
};

export const DEFAULT_USER_PROFILE_CREATE_FORM_VALUE: UserProfileCreateFormValue =
  {
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

export const DEFAULT_ORGANIZATION_PROFILE_CREATE_FORM_VALUE: OrganizationProfileCreateFormValue =
  {
    legalName: '',
    website: '',
    businessUnit: '',
    address: DEFAULT_ADDRESS_FORM_VALUE,
    billingAddress: DEFAULT_ADDRESS_FORM_VALUE,
    description: '',
    legalIdType: OrganizationLegalIdTypeDto.TaxId,
    legalId: '',
    commerceRegisterLocation: '',
  };

export const DEFAULT_CONTACTS_PROFILE_CREATE_FORM_VALUE: ContactsProfileCreateFormValue =
  {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  };

export const DEFAULT_ORGANIZATION_REGISTRATION_PAGE_FORM_VALUE: OrganizationRegistrationPageParentFormValue =
  {
    userProfile: DEFAULT_USER_PROFILE_CREATE_FORM_VALUE,
    organizationProfile: DEFAULT_ORGANIZATION_PROFILE_CREATE_FORM_VALUE,
    mainContactProfile: DEFAULT_CONTACTS_PROFILE_CREATE_FORM_VALUE,
    technicalContactProfile: DEFAULT_CONTACTS_PROFILE_CREATE_FORM_VALUE,
    acceptedConditions: false,
  };
