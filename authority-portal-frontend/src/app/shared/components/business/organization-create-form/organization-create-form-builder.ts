import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {phoneNumberValidator} from '../../../../core/utils/validators/phone-number-validator';
import {urlValidator} from '../../../../core/utils/validators/url-validator';
import {zipCodeValidator} from '../../../../core/utils/validators/zipcode-validator';
import {
  OrganizationCreateFormModel,
  OrganizationCreateFormValue,
} from './organization-create-form-model';

export const buildOrganizationCreateForm = (
  formBuilder: FormBuilder,
  initialOrganization: OrganizationCreateFormValue,
): FormGroup<OrganizationCreateFormModel> => {
  return formBuilder.nonNullable.group({
    legalName: [initialOrganization.legalName, [Validators.required]],
    website: [initialOrganization.website, [Validators.required, urlValidator]],
    businessUnit: [initialOrganization.businessUnit],
    industry: [initialOrganization.industry],
    description: [initialOrganization.description, [Validators.required]],
    mainAddressStreet: [
      initialOrganization.mainAddressStreet,
      [Validators.required],
    ],
    mainAddressCity: [
      initialOrganization.mainAddressCity,
      [Validators.required],
    ],
    mainAddressHouseNo: [
      initialOrganization.mainAddressHouseNo,
      [Validators.required],
    ],
    mainAddressZipCode: [
      initialOrganization.mainAddressZipCode,
      [Validators.required, zipCodeValidator],
    ],
    mainAddressCountry: [
      initialOrganization.mainAddressCountry,
      [Validators.required],
    ],
    billingAddressSameAsMain: [true],
    billingAddressStreet: [
      initialOrganization.billingAddressStreet,
      [Validators.required],
    ],
    billingAddressCity: [
      initialOrganization.billingAddressCity,
      [Validators.required],
    ],
    billingAddressHouseNo: [
      initialOrganization.billingAddressHouseNo,
      [Validators.required],
    ],
    billingAddressZipCode: [
      initialOrganization.billingAddressZipCode,
      [Validators.required, zipCodeValidator],
    ],
    billingAddressCountry: [
      initialOrganization.billingAddressCountry,
      [Validators.required],
    ],
    legalIdType: [initialOrganization.legalIdType, [Validators.required]],
    legalId: [initialOrganization.legalId, [Validators.required]],
    commerceRegisterLocation: [
      initialOrganization.commerceRegisterLocation,
      [Validators.required],
    ],
    mainContactFirstName: [
      initialOrganization.mainContactFirstName,
      [Validators.required],
    ],
    mainContactLastName: [
      initialOrganization.mainContactLastName,
      [Validators.required],
    ],
    mainContactPhoneNumber: [
      initialOrganization.mainContactPhoneNumber,
      [Validators.required, phoneNumberValidator],
    ],
    mainContactEmail: [
      initialOrganization.mainContactEmail,
      [Validators.required, Validators.email],
    ],
    technicalContactSameAsMain: [true],
    technicalContactFirstName: [
      initialOrganization.technicalContactFirstName,
      [Validators.required],
    ],
    technicalContactLastName: [
      initialOrganization.technicalContactLastName,
      [Validators.required],
    ],
    technicalContactPhoneNumber: [
      initialOrganization.technicalContactPhoneNumber,
      [Validators.required, phoneNumberValidator],
    ],
    technicalContactEmail: [
      initialOrganization.technicalContactEmail,
      [Validators.required, Validators.email],
    ],
  });
};
