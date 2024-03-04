import {
  ComponentStatusOverview,
  UptimeStatusDto,
} from '@sovity.de/authority-portal-client';

const up = (): UptimeStatusDto => ({
  componentStatus: 'UP',
  uptimePercentage: 99.1,
  timeSpan: {
    seconds: 2592000,
  },
  upSince: {
    seconds: 2592000,
  },
});

const maintenance = (): UptimeStatusDto => ({
  componentStatus: 'MAINTENANCE',
  uptimePercentage: 69.9,
  timeSpan: {
    seconds: 2592000,
  },
  upSince: {
    seconds: 0,
  },
});

const nullStatus = (): UptimeStatusDto => ({
  componentStatus: 'PENDING',
  uptimePercentage: 0,
  timeSpan: {
    seconds: 2592000,
  },
  upSince: {},
});

const results: ComponentStatusOverview[] = [
  {
    brokerStatus: up(),
    dapsStatus: up(),
    loggingHouseStatus: maintenance(),
    onlineConnectors: 20,
    disturbedConnectors: 2,
    offlineConnectors: 1,
  },
  {
    brokerStatus: up(),
    dapsStatus: up(),
    loggingHouseStatus: up(),
    onlineConnectors: 1,
    disturbedConnectors: 0,
    offlineConnectors: 0,
  },
  {
    brokerStatus: undefined,
    dapsStatus: undefined,
    loggingHouseStatus: undefined,
    onlineConnectors: 0,
    disturbedConnectors: 0,
    offlineConnectors: 0,
  },
  {
    brokerStatus: nullStatus(),
    dapsStatus: nullStatus(),
    loggingHouseStatus: nullStatus(),
    onlineConnectors: 0,
    disturbedConnectors: 0,
    offlineConnectors: 0,
  },
];

// rotate results
let i = 0;
export const getComponentStatus = (): ComponentStatusOverview => {
  const result = results[i];
  i = (i + 1) % results.length;
  return result;
};
