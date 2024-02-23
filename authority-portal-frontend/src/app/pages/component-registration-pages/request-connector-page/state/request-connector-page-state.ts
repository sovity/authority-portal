export interface RequestConnectorPageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_REQUEST_CONNECTOR_STATE: RequestConnectorPageState = {
  state: 'editing',
};
