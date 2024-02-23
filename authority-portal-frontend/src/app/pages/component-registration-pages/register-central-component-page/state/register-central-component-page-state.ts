export interface RegisterCentralComponentPageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
  createdCentralComponentId: string | null;
}

export const DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_STATE: RegisterCentralComponentPageState =
  {
    state: 'editing',
    createdCentralComponentId: null,
  };
