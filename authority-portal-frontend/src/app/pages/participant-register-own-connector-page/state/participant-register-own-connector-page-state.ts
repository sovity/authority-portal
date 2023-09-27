import {
  CreateConnectorRequest,
  IdResponse,
} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface ParticipantRegisterOwnConnectorPageState {
  registerOwnConnectorForm: {
    model?: CreateConnectorRequest;
    dirty: boolean;
    status: string;
    errors: {[key: string]: string};
  };
  response: Fetched<IdResponse>;
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE: ParticipantRegisterOwnConnectorPageState =
  {
    registerOwnConnectorForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
    response: Fetched.empty(),
  };
