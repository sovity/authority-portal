import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface ParticipantOwnConnectorDetailPageState {
  connectorId: string;
  connector: Fetched<ConnectorDetailDto>;
}

export const DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE: ParticipantOwnConnectorDetailPageState =
  {
    connectorId: '',
    connector: Fetched.empty(),
  };
