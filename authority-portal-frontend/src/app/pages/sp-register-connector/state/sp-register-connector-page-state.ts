import {
  CreateProvidedConnectorRequest,
  IdResponse,
} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface SpRegisterConnectorPageState {
  registerConnectorForm: {
    model?: CreateProvidedConnectorRequest;
    dirty: boolean;
    status: string;
    errors: {[key: string]: string};
  };
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_SP_REGISTER_CONNECTOR_STATE: SpRegisterConnectorPageState =
  {
    registerConnectorForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
    state: 'editing',
  };
