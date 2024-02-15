export interface AuthorityInviteNewOrganizationPageState {
  id: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE: AuthorityInviteNewOrganizationPageState =
  {
    id: '',
    state: 'editing',
  };
