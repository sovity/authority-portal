import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type AuthorityInviteNewOrganizationPageFormValue =
  ɵFormGroupRawValue<AuthorityInviteNewOrganizationPageFormModel>;

export interface AuthorityInviteNewOrganizationPageFormModel {
  userEmail: FormControl<string>;
  userFirstName: FormControl<string>;
  userLastName: FormControl<string>;
  orgName: FormControl<string>;
  orgAddress: FormControl<string>;
  orgDuns: FormControl<string>;
  orgUrl: FormControl<string>;
  orgSecurityEmail: FormControl<string>;
}

export const DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_FORM_VALUE: AuthorityInviteNewOrganizationPageFormValue =
  {
    userEmail: '',
    userFirstName: '',
    userLastName: '',
    orgName: '',
    orgAddress: '',
    orgDuns: '',
    orgUrl: '',
    orgSecurityEmail: '',
  };
