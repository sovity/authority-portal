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
import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface AuthorityConnectorDetailPageState {
  connectorId: string;
  connector: Fetched<ConnectorDetailDto>;
}

export const DEFAULT_AUTHORITY_CONNECTOR_DETAIL_PAGE_STATE: AuthorityConnectorDetailPageState =
  {
    connectorId: '',
    connector: Fetched.empty(),
  };
