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

export interface ParticipantOwnConnectorDetailPageState {
  connectorId: string;
  connector: Fetched<ConnectorDetailDto>;
}

export const DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE: ParticipantOwnConnectorDetailPageState =
  {
    connectorId: '',
    connector: Fetched.empty(),
  };
