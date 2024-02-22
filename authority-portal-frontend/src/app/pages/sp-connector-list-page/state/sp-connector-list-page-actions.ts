const tag = 'SpConnectorListPage';

export class GetProvidedConnectors {
  static readonly type = `[${tag}]  Get Provided Connectors`;
}

export class DeleteProvidedConnector {
  static readonly type = `[${tag}]  Delete Provided Connector`;
  constructor(public connectorId: string) {}
}

export class ShowConnectorDetail {
  static readonly type = `[${tag}]  Show Connector Details Slider`;
}

export class CloseConnectorDetail {
  static readonly type = `[${tag}]  Close Connector Details Slider`;
}
