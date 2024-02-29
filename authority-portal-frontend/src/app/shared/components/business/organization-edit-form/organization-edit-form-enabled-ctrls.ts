import {OrganizationEditFormValue} from './organization-edit-form-model';

export const organizationEditFormEnabledCtrls = (
  value: OrganizationEditFormValue,
): Record<keyof OrganizationEditFormValue, boolean> => {
  const billingAddressEnabled = !value.billingAddressSameAsMain;
  const technicalContactEnabled = !value.technicalContactSameAsMain;

  return {
    website: true,
    businessUnit: true,
    industry: true,
    description: true,

    mainAddress: true,

    billingAddressSameAsMain: true,
    billingAddress: billingAddressEnabled,

    mainContactName: true,
    mainContactPhoneNumber: true,
    mainContactEmail: true,
    technicalContactSameAsMain: true,
    technicalContactName: technicalContactEnabled,
    technicalContactPhoneNumber: technicalContactEnabled,
    technicalContactEmail: technicalContactEnabled,
  };
};
