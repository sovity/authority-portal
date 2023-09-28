import {IdResponse} from '@sovity.de/authority-portal-client';
import {CreateOrganizationRequest} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

interface CreateOrganizationRequestWithCheck extends CreateOrganizationRequest {
  authorizedCheck: boolean;
}

export interface OrganizationCreatePageState {
  organizationCreatePageForm: {
    model?: CreateOrganizationRequestWithCheck;
    dirty: boolean;
    status: string;
    errors: {[key: string]: string};
  };
  id: string;

  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_ORGANIZATION_CREATE_PAGE_STATE: OrganizationCreatePageState =
  {
    organizationCreatePageForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
    id: '',
    state: 'editing',
  };
