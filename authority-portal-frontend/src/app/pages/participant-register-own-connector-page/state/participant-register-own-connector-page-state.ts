import {
  NgxsFormState,
  initialFormState,
} from 'src/app/core/utils/ngxs-forms-utils';
import {
  DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_PARENT_FORM_VALUE,
  ParticipantRegisterOwnConnectorPageParentForm,
} from '../participant-register-own-connector-page/participant-register-own-connector-page-form-model';

export interface ParticipantRegisterOwnConnectorPageState {
  registerOwnConnectorParentForm: NgxsFormState<ParticipantRegisterOwnConnectorPageParentForm>;

  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE: ParticipantRegisterOwnConnectorPageState =
  {
    registerOwnConnectorParentForm: initialFormState(
      DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_PARENT_FORM_VALUE,
    ),
    state: 'editing',
  };
