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
  CatalogDataOfferConnectorOnlineStatusEnum,
  DataOfferDetailPageResultConnectorOnlineStatusEnum,
} from '@sovity.de/authority-portal-client';

export type ConnectorOnlineStatus =
  | CatalogDataOfferConnectorOnlineStatusEnum
  | DataOfferDetailPageResultConnectorOnlineStatusEnum;

export function getOnlineStatusColor(status: ConnectorOnlineStatus): string {
  switch (status) {
    case 'ONLINE':
      return 'broker-online-status-online';
    case 'OFFLINE':
      return 'broker-online-status-offline';
    case 'DEAD':
      return 'broker-online-status-dead';
    default:
      return '';
  }
}

export function getOnlineStatusIcon(status: ConnectorOnlineStatus): string {
  switch (status) {
    case 'ONLINE':
      return 'cloud_done';
    case 'OFFLINE':
      return 'pause_circle';
    case 'DEAD':
      return 'remove_circle';
    default:
      return '';
  }
}

export function getOnlineStatusSmallIcon(
  status: ConnectorOnlineStatus,
): string {
  switch (status) {
    case 'ONLINE':
      return 'cloud_done';
    case 'OFFLINE':
      return 'pause_circle';
    case 'DEAD':
      return 'remove_circle';
    default:
      return '';
  }
}
