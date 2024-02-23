export interface RegisterConnectorPageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
  connectorConfig: string;
}

export const DEFAULT_REGISTER_CONNECTOR_PAGE_STATE: RegisterConnectorPageState =
  {
    state: 'editing',
    connectorConfig: '',
  };
