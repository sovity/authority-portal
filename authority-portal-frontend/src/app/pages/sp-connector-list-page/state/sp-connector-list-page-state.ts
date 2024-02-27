import {ProvidedConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface SpConnectorListPageState {
  connectors: Fetched<ProvidedConnectorOverviewEntryDto[]>;
  busy: boolean;
  showDetail: boolean;
}

export const DEFAULT_SP_CONNECTOR_LIST_PAGE_STATE: SpConnectorListPageState = {
  connectors: Fetched.empty(),
  busy: false,
  showDetail: false,
};
