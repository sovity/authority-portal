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
import {ConfigureProvidedConnectorPageFormValue} from '../provide-connector-page/configure-provided-connector-page-form-model';

const tag = 'ProvideConnectorPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
}

export class Submit {
  static readonly type = `[${tag}] Provide Connector`;
  constructor(
    public request: ConfigureProvidedConnectorPageFormValue,
    public organizationId: string,
    public connectorId: string,
    public enableForm: () => void,
    public disableForm: () => void,
    public success: () => void,
  ) {}
}

export class GetOrganizations {
  static readonly type = `[${tag}] Refresh Organizations`;
}

export class GetConnector {
  static readonly type = `[${tag}] Get Connector`;
  constructor(public connectorId: string) {}
}
