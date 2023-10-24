import {
  CreateProvidedConnectorRequest,
  IdResponse,
} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  NgxsFormState,
  initialFormState,
} from 'src/app/core/utils/ngxs-forms-utils';
import {DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE} from '../provide-connector/provide-connector-page-form-model';

export interface ProvideConnectorPageState {
  registerConnectorForm: NgxsFormState<CreateProvidedConnectorRequest>;

  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_PROVIDE_CONNECTOR_STATE: ProvideConnectorPageState = {
  registerConnectorForm: initialFormState(DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE),
  state: 'editing',
};
