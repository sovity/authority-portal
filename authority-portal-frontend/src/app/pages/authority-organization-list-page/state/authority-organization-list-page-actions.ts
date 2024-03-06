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
const tag = 'AuthorityOrganizationListPage';

export class RefreshOrganizations {
  static readonly type = `[${tag}] Refresh Organizations`;
}

export class ShowOrganizationDetail {
  static readonly type = `[${tag}]  Show Organization Details Slider`;
}

export class CloseOrganizationDetail {
  static readonly type = `[${tag}]  Close Organization Details Slider`;
}
