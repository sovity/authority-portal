import {FormControl, ɵFormGroupRawValue} from '@angular/forms';
import {OrganizationLegalIdTypeDto} from '@sovity.de/authority-portal-client';

export interface OrganizationProfileFormModel {
  legalName: FormControl<string>;
  website: FormControl<string>;
  businessUnit: FormControl<string>;
  description: FormControl<string>;

  mainAddressStreet: FormControl<string>;
  mainAddressCity: FormControl<string>;
  mainAddressHouseNo: FormControl<string>;
  mainAddressZipCode: FormControl<string>;
  mainAddressCountry: FormControl<string>;

  billingAddressSameAsMain: FormControl<boolean>;
  billingAddressStreet: FormControl<string>;
  billingAddressCity: FormControl<string>;
  billingAddressHouseNo: FormControl<string>;
  billingAddressZipCode: FormControl<string>;
  billingAddressCountry: FormControl<string>;

  mainContactFirstName: FormControl<string>;
  mainContactLastName: FormControl<string>;
  mainContactPhoneNumber: FormControl<string>;
  mainContactEmail: FormControl<string>;

  technicalContactSameAsMain: FormControl<boolean>;
  technicalContactFirstName: FormControl<string>;
  technicalContactLastName: FormControl<string>;
  technicalContactPhoneNumber: FormControl<string>;
  technicalContactEmail: FormControl<string>;

  legalIdType: FormControl<OrganizationLegalIdTypeDto>;
  legalId: FormControl<string>;
  commerceRegisterLocation: FormControl<string>;
}

export type OrganizationProfileFormValue =
  ɵFormGroupRawValue<OrganizationProfileFormModel>;

export const DEFAULT_ORGANIZATION_PROFILE_FORM_MODEL: OrganizationProfileFormValue =
  {
    legalName: '',
    website: '',
    businessUnit: '',
    description: '',

    mainAddressStreet: '',
    mainAddressCity: '',
    mainAddressHouseNo: '',
    mainAddressZipCode: '',
    mainAddressCountry: '',

    billingAddressSameAsMain: true,
    billingAddressStreet: '',
    billingAddressCity: '',
    billingAddressHouseNo: '',
    billingAddressZipCode: '',
    billingAddressCountry: '',

    legalIdType: OrganizationLegalIdTypeDto.TaxId,
    legalId: '',
    commerceRegisterLocation: '',

    mainContactFirstName: '',
    mainContactLastName: '',
    mainContactPhoneNumber: '',
    mainContactEmail: '',
    technicalContactSameAsMain: true,
    technicalContactFirstName: '',
    technicalContactLastName: '',
    technicalContactPhoneNumber: '',
    technicalContactEmail: '',
  };
