const tag = 'ParticipantOwnConnectorListPage';

export class GetOwnOrganizationConnectors {
  static readonly type = `[${tag}]  Get Own Organization Connectors`;
}

export class DeleteOwnConnector {
  static readonly type = `[${tag}]  Delete Own Connector`;
  constructor(public connectorId: string) {}
}
