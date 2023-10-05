import {OrganizationDetailResult} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface AuthorityOrganizationDetailPageState {
  organizationMdsId: string;
  organization: Fetched<OrganizationDetailResult>;
  busy: boolean;
}

export const DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE: AuthorityOrganizationDetailPageState =
  {
    organizationMdsId: '',
    organization: Fetched.empty(),
    busy: false,
  };
