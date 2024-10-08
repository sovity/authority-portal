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

const tag = 'ParticipantOwnConnectorDetailPage';

export class SetConnectorId {
  static readonly type = `[${tag}] Set Connector Id`;
  constructor(public connectorId: string) {}
}

export class RefreshConnector {
  static readonly type = `[${tag}] Refresh Connector`;
}

export class RefreshConnectorSilent {
  static readonly type = `[${tag}] Refresh Connector (silent)`;
}
