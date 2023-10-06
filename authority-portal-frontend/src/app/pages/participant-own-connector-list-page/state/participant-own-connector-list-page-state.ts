import {ConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface ParticipantOwnConnectorListPageState {
  connectors: Fetched<ConnectorOverviewEntryDto[]>;
}

export const DEFAULT_PARTICIPANT_OWN_CONNECTOR_LIST_PAGE_STATE: ParticipantOwnConnectorListPageState =
  {
    connectors: Fetched.empty(),
  };