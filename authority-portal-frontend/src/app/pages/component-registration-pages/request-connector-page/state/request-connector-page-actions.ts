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
import {CreateCaasRequest} from '@sovity.de/authority-portal-client';

const tag = 'RequestConnectorPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;
}

export class Submit {
  static readonly type = `[${tag}] Request Connector`;
  constructor(
    public request: CreateCaasRequest,
    public enableForm: () => void,
    public disableForm: () => void,
  ) {}
}
