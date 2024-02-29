import {
  OwnOrganizationDetailsDto,
  UpdateOrganizationDto,
} from '@sovity.de/authority-portal-client';
import {ControlCenterOrganizationEditPageFormValue} from './control-center-organization-edit-page.form-model';

export function buildFormValue(
  organization: OwnOrganizationDetailsDto,
): ControlCenterOrganizationEditPageFormValue {
  let billingAddressSameAsMain =
    organization.mainAddress === organization.billingAddress;
  let technicalContactSameAsMain =
    organization.mainContactName === organization.techContactName &&
    organization.mainContactPhone === organization.techContactPhone &&
    organization.mainContactEmail === organization.techContactEmail;

  return {
    website: organization.url,
    businessUnit: organization.businessUnit ?? '',
    industry: organization.industry ?? null,
    description: organization.description,

    mainAddress: organization.mainAddress,
    billingAddressSameAsMain,
    billingAddress: billingAddressSameAsMain ? '' : organization.billingAddress,

    mainContactName: organization.mainContactName,
    mainContactPhoneNumber: organization.mainContactPhone,
    mainContactEmail: organization.mainContactEmail,
    technicalContactSameAsMain,
    technicalContactName: technicalContactSameAsMain
      ? ''
      : organization.techContactName,
    technicalContactPhoneNumber: technicalContactSameAsMain
      ? ''
      : organization.techContactPhone,
    technicalContactEmail: technicalContactSameAsMain
      ? ''
      : organization.techContactEmail,
  };
}

export function buildEditRequest(
  formValue: ControlCenterOrganizationEditPageFormValue,
): UpdateOrganizationDto {
  return {
    url: formValue.website,
    businessUnit: formValue.businessUnit,
    industry: formValue.industry ?? undefined,
    description: formValue.description,

    address: formValue.mainAddress,
    billingAddress: formValue.billingAddressSameAsMain
      ? formValue.mainAddress
      : formValue.billingAddress,

    mainContactName: formValue.mainContactName,
    mainContactPhone: formValue.mainContactPhoneNumber,
    mainContactEmail: formValue.mainContactEmail,
    techContactName: formValue.technicalContactSameAsMain
      ? formValue.mainContactName
      : formValue.technicalContactName,
    techContactPhone: formValue.technicalContactSameAsMain
      ? formValue.mainContactPhoneNumber
      : formValue.technicalContactPhoneNumber,
    techContactEmail: formValue.technicalContactSameAsMain
      ? formValue.mainContactEmail
      : formValue.technicalContactEmail,
  };
}
