import {CreateProvidedConnectorRequest} from '@sovity.de/authority-portal-client';
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
  registerConnectorForm: initialFormState<CreateProvidedConnectorRequest>({
    mdsId: DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE.mdsId,
    environmentId: DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE.environmentId,
    createConnectorRequest: {
      name: DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE.name,
      location: DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE.location,
      url: DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE.url,
      certificate: DEFAULT_PROVIDE_CONNECTOR_FORM_VALUE.certificate,
    },
  }),
  state: 'editing',
};
