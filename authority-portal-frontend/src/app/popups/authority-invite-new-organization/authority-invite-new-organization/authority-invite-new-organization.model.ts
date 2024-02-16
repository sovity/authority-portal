import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export type AuthorityInviteNewOrganizationPageFormValue =
  ɵFormGroupRawValue<AuthorityInviteNewOrganizationPageFormModel>;

export interface AuthorityInviteNewOrganizationPageFormModel {
  userEmail: FormControl<string>;
  userFirstName: FormControl<string>;
  userLastName: FormControl<string>;
  orgName: FormControl<string>;
  userJobTitle: FormControl<string>;
  userPhoneNumber: FormControl<string>;
}

export const DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_FORM_VALUE: AuthorityInviteNewOrganizationPageFormValue =
  {
    userEmail: '',
    userFirstName: '',
    userLastName: '',
    orgName: '',
    userJobTitle: '',
    userPhoneNumber: '',
  };
