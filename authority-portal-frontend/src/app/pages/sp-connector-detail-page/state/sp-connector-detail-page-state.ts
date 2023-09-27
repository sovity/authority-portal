import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface SpConnectorDetailPageState {
  connectorId: string;
  connector: Fetched<ConnectorDetailDto>;
}

export const DEFAULT_SP_CONNECTOR_DETAIL_PAGE_STATE: SpConnectorDetailPageState =
  {
    connectorId: '',
    connector: Fetched.empty(),
  };
