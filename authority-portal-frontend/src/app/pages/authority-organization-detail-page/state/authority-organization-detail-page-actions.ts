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

const tag = 'AuthorityOrganizationDetailPage';

export class SetOrganizationId {
  static readonly type = `[${tag}] Set Organization Id`;
  constructor(public organizationId: string) {}
}

export class RefreshOrganization {
  static readonly type = `[${tag}] Refresh Organization`;
  constructor(public cb?: () => void) {}
}

export class ApproveOrganization {
  static readonly type = `[${tag}] Approve Organization`;
}

export class RejectOrganization {
  static readonly type = `[${tag}] Reject Organization`;
}

// Opened User detail Actions

export class SetOrganizationUserId {
  static readonly type = `[${tag}] Set Currently Opened Organization User Id`;
  constructor(public organizationId: string, public userId: string) {}
}

export class RefreshOrganizationUser {
  static readonly type = `[${tag}] Refresh Currently Opened Organization User`;
}

export class DeactivateUser {
  static readonly type = `[${tag}] Deactivate Currently Opened Organization User`;
  constructor(public userId: string) {}
}

export class ReactivateUser {
  static readonly type = `[${tag}] Reactivate Currently Opened Organization User`;
  constructor(public userId: string) {}
}
