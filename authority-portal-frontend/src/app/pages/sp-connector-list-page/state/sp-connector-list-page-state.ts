import {ConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface SpConnectorListPageState {
  connectors: Fetched<ConnectorOverviewEntryDto[]>;
}

export const DEFAULT_SP_CONNECTOR_LIST_PAGE_STATE: SpConnectorListPageState = {
  connectors: Fetched.empty(),
};
