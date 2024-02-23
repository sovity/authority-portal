const tag = 'AuthorityConnectorListPage';

export class GetConnectors {
  static readonly type = `[${tag}]  Get Connectors`;
}

export class ShowConnectorDetail {
  static readonly type = `[${tag}]  Show Connector Details Slider`;
}

export class CloseConnectorDetail {
  static readonly type = `[${tag}]  Close Connector Details Slider`;
}

export class DeleteConnector {
  static readonly type = `[${tag}]  Delete Connector`;
  constructor(public connectorId: string) {}
}
