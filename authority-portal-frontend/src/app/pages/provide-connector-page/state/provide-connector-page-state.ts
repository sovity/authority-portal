import {CreateConnectorRequest} from '@sovity.de/authority-portal-client';
import {
  NgxsFormState,
  initialFormState,
} from 'src/app/core/utils/ngxs-forms-utils';
import {DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE} from '../provide-connector-page/provide-connector-page-form-model';

export interface ProvideConnectorPageState {
  provideConnectorForm: NgxsFormState<CreateConnectorRequest>;

  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_PROVIDE_CONNECTOR_STATE: ProvideConnectorPageState = {
  provideConnectorForm: initialFormState(DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE),
  state: 'editing',
};
