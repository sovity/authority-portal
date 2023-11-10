import {CreateProvidedConnectorRequest} from '@sovity.de/authority-portal-client';

const tag = 'ProvideConnectorPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
}

export class Submit {
  static readonly type = `[${tag}] Provide Connector`;
  constructor(
    public request: CreateProvidedConnectorRequest,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}
