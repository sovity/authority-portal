import {Fetched} from '../../../core/utils/fetched';

/**
 * Should be imported from @sovity.de/authority-portal-client, but endpoint does not exist yet
 */
export interface OrganizationListEntry {
  id: string;
}

export interface OrganizationListPageState {
  organizations: Fetched<OrganizationListEntry[]>;
}

export const DEFAULT_ORGANIZATION_LIST_PAGE_STATE: OrganizationListPageState = {
  organizations: Fetched.empty(),
};
