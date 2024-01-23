export interface CentralComponentCreatePageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_CENTRAL_COMPONENT_CREATE_STATE: CentralComponentCreatePageState =
  {
    state: 'editing',
  };
