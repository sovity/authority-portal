import {CentralComponentCreateRequest} from '@sovity.de/authority-portal-client';

const tag = 'CentralComponentCreatePage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
}

export class Submit {
  static readonly type = `[${tag}] Register Connector`;
  constructor(
    public request: CentralComponentCreateRequest,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}
