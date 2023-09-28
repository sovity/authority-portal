import {
  CreateConnectorRequest,
  CreateProvidedConnectorRequest,
} from '@sovity.de/authority-portal-client';

const tag = 'ServiceProviderRegisterConnectorPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
}

export class Submit {
  static readonly type = `[${tag}] Register Connector`;
  constructor(
    public request: CreateConnectorRequest,
    public mdsId: string,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}
