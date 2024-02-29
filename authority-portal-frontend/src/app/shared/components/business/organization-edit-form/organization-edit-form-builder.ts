import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {phoneNumberValidator} from '../../../../core/utils/validators/phone-number-validator';
import {urlValidator} from '../../../../core/utils/validators/url-validator';
import {
  OrganizationEditFormModel,
  OrganizationEditFormValue,
} from './organization-edit-form-model';

export const buildOrganizationEditForm = (
  formBuilder: FormBuilder,
  initialOrganization: OrganizationEditFormValue,
): FormGroup<OrganizationEditFormModel> => {
  return formBuilder.nonNullable.group({
    website: [initialOrganization.website, [Validators.required, urlValidator]],
    businessUnit: [initialOrganization.businessUnit],
    industry: [initialOrganization.industry],
    description: [initialOrganization.description, [Validators.required]],
    mainAddress: [initialOrganization.mainAddress, [Validators.required]],
    billingAddressSameAsMain: [
      initialOrganization.billingAddressSameAsMain,
      [Validators.required],
    ],
    billingAddress: [initialOrganization.billingAddress, [Validators.required]],
    mainContactName: [
      initialOrganization.mainContactName,
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
    technicalContactSameAsMain: [
      initialOrganization.technicalContactSameAsMain,
      [Validators.required],
    ],
    technicalContactName: [
      initialOrganization.technicalContactName,
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
