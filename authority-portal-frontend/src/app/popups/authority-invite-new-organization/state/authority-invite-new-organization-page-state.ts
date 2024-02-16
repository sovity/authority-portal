import {InviteOrganizationRequest} from '@sovity.de/authority-portal-client';
import {DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_FORM_VALUE} from '../authority-invite-new-organization/authority-invite-new-organization.model';

export interface AuthorityInviteNewOrganizationPageState {
  id: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE: AuthorityInviteNewOrganizationPageState =
  {
    id: '',
    state: 'editing',
  };
