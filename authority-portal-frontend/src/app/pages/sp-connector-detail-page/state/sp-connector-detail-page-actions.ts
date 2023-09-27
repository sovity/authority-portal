const tag = 'SpConnectorDetailPage';

export class RefreshConnector {
  static readonly type = `[${tag}] Refresh Connector`;
  constructor(public connectorId: string) {}
}
