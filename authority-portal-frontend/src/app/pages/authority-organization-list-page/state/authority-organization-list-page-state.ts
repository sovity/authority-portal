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
import {OrganizationOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface AuthorityOrganizationListPageState {
  organizations: Fetched<OrganizationOverviewEntryDto[]>;
  showDetail: boolean;
}

export const DEFAULT_AUTHORITY_ORGANIZATION_LIST_PAGE_STATE: AuthorityOrganizationListPageState =
  {
    organizations: Fetched.empty(),
    showDetail: false,
  };
