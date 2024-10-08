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
import {
  ConnectorDetailsDto,
  OrganizationOverviewEntryDto,
} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface ConfigureProvidedConnectorPageState {
  state: 'editing' | 'submitting' | 'success' | 'error';
  organizationList: Fetched<OrganizationOverviewEntryDto[]>;
  connectorConfig: string;
  localConnectorConfig: string;
  connectorData: ConnectorDetailsDto | null;
}

export const DEFAULT_PROVIDE_CONNECTOR_PAGE_STATE: ConfigureProvidedConnectorPageState =
  {
    state: 'editing',
    organizationList: Fetched.empty(),
    connectorConfig: '',
    localConnectorConfig: '',
    connectorData: null,
  };
