import {OrganizationOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  NgxsFormState,
  initialFormState,
} from 'src/app/core/utils/ngxs-forms-utils';
import {
  DEFAULT_PROVIDE_CONNECTOR_PARENT_FORM_VALUE,
  ProvideConnectorPageParentForm,
} from '../provide-connector-page/provide-connector-page-form-model';

export interface ProvideConnectorPageState {
  provideConnectorForm: NgxsFormState<ProvideConnectorPageParentForm>;
  connectorId: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
  organizationList: Fetched<OrganizationOverviewEntryDto[]>;
}

export const DEFAULT_PROVIDE_CONNECTOR_STATE: ProvideConnectorPageState = {
  provideConnectorForm: initialFormState(
    DEFAULT_PROVIDE_CONNECTOR_PARENT_FORM_VALUE,
  ),
  connectorId: '',
  state: 'editing',
  organizationList: Fetched.empty(),
};
