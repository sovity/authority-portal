export interface OrganizationRegistrationPageState {
  id: string;
  email: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE: OrganizationRegistrationPageState =
  {
    id: '',
    email: '',
    state: 'editing',
  };
