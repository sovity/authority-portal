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
  ComponentStatusOverview,
  UptimeStatusDto,
} from '@sovity.de/authority-portal-client';

const up = (): UptimeStatusDto => ({
  componentStatus: 'UP',
  uptimePercentage: 99.1,
  timeSpanSeconds: 2592000,
  upSinceSeconds: 2592000,
});

const maintenance = (): UptimeStatusDto => ({
  componentStatus: 'MAINTENANCE',
  uptimePercentage: 69.9,
  timeSpanSeconds: 2592000,
  upSinceSeconds: 0,
});

const down = (): UptimeStatusDto => ({
  componentStatus: 'DOWN',
  uptimePercentage: 51.2,
  timeSpanSeconds: 2592000,
  upSinceSeconds: 0,
});

export const getComponentStatus = (
  environmentId: string,
): ComponentStatusOverview => {
  if (environmentId === 'development') {
    return {
      dapsStatus: maintenance(),
      loggingHouseStatus: down(),
      onlineConnectors: 20,
      disturbedConnectors: 2,
      offlineConnectors: 1,
    };
  } else if (environmentId === 'staging') {
    return {
      dapsStatus: undefined,
      loggingHouseStatus: undefined,
      onlineConnectors: 0,
      disturbedConnectors: 0,
      offlineConnectors: 0,
    };
  } else {
    return {
      dapsStatus: up(),
      loggingHouseStatus: up(),
      onlineConnectors: 1,
      disturbedConnectors: 0,
      offlineConnectors: 0,
    };
  }
};
