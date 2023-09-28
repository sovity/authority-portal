import {CreateConnectorRequest} from '@sovity.de/authority-portal-client';

export interface ParticipantRegisterOwnConnectorPageState {
  registerOwnConnectorForm: {
    model?: CreateConnectorRequest;
    dirty: boolean;
    status: string;
    errors: {[key: string]: string};
  };
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE: ParticipantRegisterOwnConnectorPageState =
  {
    registerOwnConnectorForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
    state: 'editing',
  };
