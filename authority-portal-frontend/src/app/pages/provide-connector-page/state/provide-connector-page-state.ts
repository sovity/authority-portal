import {OrganizationOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface ProvideConnectorPageState {
  connectorId: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
  organizationList: Fetched<OrganizationOverviewEntryDto[]>;
}

export const DEFAULT_PROVIDE_CONNECTOR_STATE: ProvideConnectorPageState = {
  connectorId: '',
  state: 'editing',
  organizationList: Fetched.empty(),
};
