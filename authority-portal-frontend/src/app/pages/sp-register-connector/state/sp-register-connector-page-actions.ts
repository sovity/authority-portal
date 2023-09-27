const tag = 'ServiceProviderRegisterConnectorPage';

export class CleanRegisterConnector {
  static readonly type = `[${tag}] Clean Register Connector Page`;
  constructor() {}
}

export class RegisterConnector {
  static readonly type = `[${tag}] Register Connector`;
  constructor(public formValue: any, public mdsId: string) {}
}
