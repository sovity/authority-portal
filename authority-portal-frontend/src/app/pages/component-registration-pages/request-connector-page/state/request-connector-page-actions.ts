import {CreateCaasRequest} from '@sovity.de/authority-portal-client';

const tag = 'RequestConnectorPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
}

export class Submit {
  static readonly type = `[${tag}] Request Connector`;
  constructor(
    public request: CreateCaasRequest,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}
