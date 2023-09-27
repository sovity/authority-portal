import {OrganizationOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface AuthorityOrganizationListPageState {
  organizations: Fetched<OrganizationOverviewEntryDto[]>;
}

export const DEFAULT_AUTHORITY_ORGANIZATION_LIST_PAGE_STATE: AuthorityOrganizationListPageState =
  {
    organizations: Fetched.empty(),
  };
