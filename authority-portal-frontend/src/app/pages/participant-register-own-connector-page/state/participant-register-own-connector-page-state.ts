export interface ParticipantRegisterOwnConnectorPageState {
  connectorId: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE: ParticipantRegisterOwnConnectorPageState =
  {
    connectorId: '',
    state: 'editing',
  };
