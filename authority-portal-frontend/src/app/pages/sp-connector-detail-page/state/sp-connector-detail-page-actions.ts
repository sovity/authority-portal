const tag = 'SpConnectorDetailPage';

export class RefreshConnector {
  static readonly type = `[${tag}] Refresh Connector`;
  constructor(public connectorId: string) {}
}

export class SetConnectorId {
  static readonly type = `[${tag}] Set Connector Id`;
  constructor(public connectorId: string) {}
}
