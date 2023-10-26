import {InviteOrganizationRequest} from '@sovity.de/authority-portal-client';
import {
  NgxsFormState,
  initialFormState,
} from 'src/app/core/utils/ngxs-forms-utils';
import {DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_FORM_VALUE} from 'src/app/pages/authority-invite-new-organization/authority-invite-new-organization/authority-invite-new-organization.model';

export interface AuthorityInviteNewOrganizationPageState {
  authorityInviteNewOrganizationPageForm: NgxsFormState<InviteOrganizationRequest>;
  id: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE: AuthorityInviteNewOrganizationPageState =
  {
    authorityInviteNewOrganizationPageForm: initialFormState(
      DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_FORM_VALUE,
    ),
    id: '',
    state: 'editing',
  };
