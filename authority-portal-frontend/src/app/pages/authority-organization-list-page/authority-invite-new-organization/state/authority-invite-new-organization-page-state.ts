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

export interface AuthorityInviteNewOrganizationPageState {
  id: string;
  state: 'editing' | 'submitting' | 'success' | 'error';
}

export const DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE: AuthorityInviteNewOrganizationPageState =
  {
    id: '',
    state: 'editing',
  };
