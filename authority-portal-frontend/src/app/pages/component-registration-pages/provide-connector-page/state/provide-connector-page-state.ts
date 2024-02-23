import {OrganizationOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface ProvideConnectorPageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
  organizationList: Fetched<OrganizationOverviewEntryDto[]>;
  connectorConfig: string;
}

export const DEFAULT_PROVIDE_CONNECTOR_PAGE_STATE: ProvideConnectorPageState = {
  state: 'editing',
  organizationList: Fetched.empty(),
  connectorConfig: '',
};
