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

import {CentralComponentDto} from '@sovity.de/authority-portal-client';

const tag = 'CentralComponentListPage';

export class RefreshCentralComponents {
  static readonly type = `[${tag}]  Refresh`;
}

export class DeleteCentralComponent {
  static readonly type = `[${tag}]  Show Central Component Delete Modal`;
  constructor(public centralComponent: CentralComponentDto) {}
}
