import {
  OwnOrganizationDetailsDto,
  UserDetailDto,
} from '@sovity.de/authority-portal-client';
import {getMainAndBillingAddresses} from '../../../../core/utils/address-utils';
import {getMainAndTechnicalContacts} from '../../../../core/utils/name-utils';
import {DEFAULT_ORGANIZATION_CREATE_FORM_MODEL} from '../../../../shared/components/business/organization-create-form/organization-create-form-model';
import {OnboardingProcessRequest} from '../state/organization-onboard-page-action';
import {
  OnboardingOrganizationTabFormValue,
  OnboardingUserTabFormValue,
  OnboardingWizardFormValue,
} from './organization-onboard-page.form-model';

export function buildInitialOnboardingFormValue(
  user: UserDetailDto,
  organizationDetail: OwnOrganizationDetailsDto,
): OnboardingWizardFormValue {
  let userTab: OnboardingUserTabFormValue = {
    firstName: user.firstName,
    lastName: user.lastName,
    jobTitle: user.position,
    phoneNumber: user.phone,

    // when it's also onboarding of an organization, there's a second TOS check
    acceptedTos: organizationDetail.registrationStatus === 'ONBOARDING',
  };
  let organizationTab: OnboardingOrganizationTabFormValue = {
    ...DEFAULT_ORGANIZATION_CREATE_FORM_MODEL,
    legalName: organizationDetail.name,
    acceptedTos: false,
  };
  return {
    userTab,
    organizationTab,
    isEditable: true,
  };
}

export function buildOnboardingRequest(
  formValue: OnboardingWizardFormValue,
): OnboardingProcessRequest {
  let user = formValue.userTab;
  let org = formValue.organizationTab;

  const {mainAddress, billingAddress} = getMainAndBillingAddresses(org);

  const {
    mainContactName,
    mainContactEmail,
    mainContactPhone,
    technicalContactName,
    technicalContactEmail,
    technicalContactPhone,
  } = getMainAndTechnicalContacts(org);

  return {
    userProfile: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      jobTitle: user?.jobTitle || '',
      phoneNumber: user?.phoneNumber || '',
    },
    organizationProfile: {
      name: org?.legalName || '',

      // Organization Metadata
      url: org?.website || '',
      description: org?.description || '',
      businessUnit: org?.businessUnit || '',
      industry: org?.industry || '',
      address: mainAddress,
      billingAddress: billingAddress,
      legalIdType: org?.legalIdType || 'TAX_ID',
      legalIdNumber: org?.legalId || '',
      commerceRegisterLocation: org?.commerceRegisterLocation || '',

      // Organization Contacts
      mainContactName,
      mainContactEmail,
      mainContactPhone,
      techContactName: technicalContactName,
      techContactEmail: technicalContactEmail,
      techContactPhone: technicalContactPhone,
    },
  };
}