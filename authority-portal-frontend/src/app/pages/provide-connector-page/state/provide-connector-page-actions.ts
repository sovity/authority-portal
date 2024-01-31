import {CreateConnectorRequest} from '@sovity.de/authority-portal-client';

const tag = 'ProvideConnectorPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
}

export class Submit {
  static readonly type = `[${tag}] Provide Connector`;
  constructor(
    public request: CreateConnectorRequest,
    public mdsId: string,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}
