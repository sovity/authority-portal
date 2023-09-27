const tag = 'ParticipantRegisterOwnConnectorPage';

export class CleanRegisterOwnConnector {
  static readonly type = `[${tag}] Clean Register Own Connector Page`;
  constructor() {}
}

export class RegisterOwnConnector {
  static readonly type = `[${tag}] Register Connector`;
  constructor(public formValue: any) {}
}
