import {RegistrationRequestDto} from '@sovity.de/authority-portal-client';
import {getMainAndBillingAddresses} from '../../../../core/utils/address-utils';
import {getMainAndTechnicalContacts} from '../../../../core/utils/name-utils';
import {RegistrationWizardFormValue} from './organization-create-page.form-model';

export function buildRegistrationRequest(
  formValue: RegistrationWizardFormValue,
): RegistrationRequestDto {
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
    // User Profile
    userEmail: user?.email || '',
    userFirstName: user?.firstName || '',
    userLastName: user?.lastName || '',
    userJobTitle: user?.jobTitle || '',
    userPhone: user?.phoneNumber || '',
    userPassword: user?.password || '',

    // Organization
    organizationName: org?.legalName || '',

    // Organization Metadata
    organizationUrl: org?.website || '',
    organizationDescription: org?.description || '',
    organizationBusinessUnit: org?.businessUnit || '',
    organizationIndustry: org?.industry || '',
    organizationAddress: mainAddress,
    organizationBillingAddress: billingAddress,
    organizationLegalIdType: org?.legalIdType!,
    organizationLegalIdNumber: org?.legalId || '',
    organizationCommerceRegisterLocation: org?.commerceRegisterLocation || '',

    // Organization Contacts
    organizationMainContactName: mainContactName,
    organizationMainContactEmail: mainContactEmail,
    organizationMainContactPhone: mainContactPhone,
    organizationTechContactName: technicalContactName,
    organizationTechContactEmail: technicalContactEmail,
    organizationTechContactPhone: technicalContactPhone,
  };
}
