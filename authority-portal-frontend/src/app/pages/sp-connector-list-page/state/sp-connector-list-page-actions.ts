/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

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
