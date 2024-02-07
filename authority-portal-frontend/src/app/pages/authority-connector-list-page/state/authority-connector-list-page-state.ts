import {ConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface AuthorityConnectorListPageState {
  connectors: Fetched<ConnectorOverviewEntryDto[]>;
  busy: boolean;
  showDetail: boolean;
}

export const DEFAULT_AUTHORITY_CONNECTOR_LIST_PAGE_STATE: AuthorityConnectorListPageState =
  {
    connectors: Fetched.empty(),
    busy: false,
    showDetail: false,
  };
