import {
  CatalogDataOfferConnectorOnlineStatusEnum,
  DataOfferDetailPageResultConnectorOnlineStatusEnum,
} from '@sovity.de/authority-portal-client';

export type ConnectorOnlineStatus =
  | CatalogDataOfferConnectorOnlineStatusEnum
  | DataOfferDetailPageResultConnectorOnlineStatusEnum

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
