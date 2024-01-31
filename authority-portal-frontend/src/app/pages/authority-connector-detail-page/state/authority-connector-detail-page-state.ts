import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface AuthorityConnectorDetailPageState {
  connectorId: string;
  connector: Fetched<ConnectorDetailDto>;
}

export const DEFAULT_AUTHORITY_CONNECTOR_DETAIL_PAGE_STATE: AuthorityConnectorDetailPageState =
  {
    connectorId: '',
    connector: Fetched.empty(),
  };
