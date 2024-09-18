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
  ConnectorStatusDto,
  ConnectorTypeDto,
} from '@sovity.de/authority-portal-client';

export const getConnectorsTypeText = (status: ConnectorTypeDto): string => {
  switch (status) {
    case ConnectorTypeDto.Own:
      return 'OWN';
    case ConnectorTypeDto.Provided:
      return 'PROVIDED';
    case ConnectorTypeDto.Caas:
      return 'CAAS';
    case ConnectorTypeDto.Configuring:
      return 'CONFIGURING';
  }
};
export const getConnectorStatusText = (status: ConnectorStatusDto): string => {
  switch (status) {
    case ConnectorStatusDto.Init:
      return 'Init';
    case ConnectorStatusDto.Provisioning:
      return 'Provisioning';
    case ConnectorStatusDto.AwaitingRunning:
      return 'Awaiting Running';
    case ConnectorStatusDto.Running:
      return 'Running';
    case ConnectorStatusDto.Deprovisioning:
      return 'Deprovisioning';
    case ConnectorStatusDto.AwaitingStopped:
      return 'Awaiting stopped';
    case ConnectorStatusDto.Stopped:
      return 'Stopped';
    case ConnectorStatusDto.Error:
      return 'Error';
    case ConnectorStatusDto.NotFound:
      return 'Not Found';
    case ConnectorStatusDto.Online:
      return 'Online';
    case ConnectorStatusDto.Offline:
      return 'Offline';
    case ConnectorStatusDto.Dead:
      return 'Dead';
    case ConnectorStatusDto.Unknown:
      return 'Unknown';
  }
};
