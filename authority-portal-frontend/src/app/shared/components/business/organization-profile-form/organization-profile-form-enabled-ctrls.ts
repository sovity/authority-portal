import {OrganizationLegalIdTypeDto} from '@sovity.de/authority-portal-client';
import {OrganizationProfileFormValue} from './organization-profile-form-model';

export const organizationProfileFormEnabledCtrls = (
  value: OrganizationProfileFormValue,
): Record<keyof OrganizationProfileFormValue, boolean> => {
  const isCommercialRegister =
    value.legalIdType === OrganizationLegalIdTypeDto.CommerceRegisterInfo;
  const billingAddressEnabled = !value.billingAddressSameAsMain;
  const technicalContactEnabled = !value.technicalContactSameAsMain;

  return {
    legalName: true,
    website: true,
    businessUnit: true,
    description: true,

    mainAddressStreet: true,
    mainAddressCity: true,
    mainAddressHouseNo: true,
    mainAddressZipCode: true,
    mainAddressCountry: true,

    billingAddressSameAsMain: true,
    billingAddressStreet: billingAddressEnabled,
    billingAddressCity: billingAddressEnabled,
    billingAddressHouseNo: billingAddressEnabled,
    billingAddressZipCode: billingAddressEnabled,
    billingAddressCountry: billingAddressEnabled,

    legalIdType: true,
    legalId: true,
    commerceRegisterLocation: isCommercialRegister,

    mainContactFirstName: true,
    mainContactLastName: true,
    mainContactPhoneNumber: true,
    mainContactEmail: true,
    technicalContactSameAsMain: true,
    technicalContactFirstName: technicalContactEnabled,
    technicalContactLastName: technicalContactEnabled,
    technicalContactPhoneNumber: technicalContactEnabled,
    technicalContactEmail: technicalContactEnabled,
  };
};
