import {CreateConnectorRequest} from '@sovity.de/authority-portal-client';
import {
  NgxsFormState,
  initialFormState,
} from 'src/app/core/utils/ngxs-forms-utils';
import {DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE} from '../participant-register-own-connector-page/participant-register-own-connector-page-form-model';

export interface ParticipantRegisterOwnConnectorPageState {
  registerOwnConnectorForm: NgxsFormState<CreateConnectorRequest>;

  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE: ParticipantRegisterOwnConnectorPageState =
  {
    registerOwnConnectorForm: initialFormState(
      DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_FORM_VALUE,
    ),
    state: 'editing',
  };
