import {IdResponse} from '@sovity.de/authority-portal-client';
import {CreateOrganizationRequest} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  NgxsFormState,
  initialFormState,
} from 'src/app/core/utils/ngxs-forms-utils';
import {DEFAULT_ORGANIZATION_CREATE_FORM_VALUE} from '../organization-create-page-form-model';

interface CreateOrganizationRequestWithCheck extends CreateOrganizationRequest {
  authorizedCheck: boolean;
}

export interface OrganizationCreatePageState {
  organizationCreatePageForm: NgxsFormState<CreateOrganizationRequestWithCheck>;
  id: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_ORGANIZATION_CREATE_PAGE_STATE: OrganizationCreatePageState =
  {
    organizationCreatePageForm: initialFormState(
      DEFAULT_ORGANIZATION_CREATE_FORM_VALUE,
    ),
    id: '',
    state: 'editing',
  };
