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
import {Fetched} from 'src/app/core/utils/fetched';

export interface ProvideConnectorPageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
  organizationList: Fetched<OrganizationOverviewEntryDto[]>;
  connectorConfig: string;
}

export const DEFAULT_PROVIDE_CONNECTOR_PAGE_STATE: ProvideConnectorPageState = {
  state: 'editing',
  organizationList: Fetched.empty(),
  connectorConfig: '',
};
