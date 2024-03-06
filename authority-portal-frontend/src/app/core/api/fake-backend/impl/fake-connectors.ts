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
  CaasAvailabilityResponse,
  CheckFreeCaasUsageRequest,
  ConnectorDetailDto,
  ConnectorOverviewResult,
  ConnectorTypeDto,
  CreateCaasRequest,
  CreateConnectorRequest,
  CreateConnectorResponse,
  CreateConnectorStatusDto,
  DeleteOwnConnectorRequest,
  IdResponse,
  ProvidedConnectorOverviewEntryDto,
  ProvidedConnectorOverviewResult,
} from '@sovity.de/authority-portal-client';
import {fakeEnv} from './fake-environments';
import {TEST_ORGANIZATIONS} from './fake-organizations';
import {getUserInfo} from './fake-users';

export let TEST_CONNECTORS: ConnectorDetailDto[] = [
  {
    connectorId: 'MDSL1111AA.AP12I3U',
    type: ConnectorTypeDto.Own,
    orgName: 'Example Organization',
    orgMdsId: 'MDSL1111AA',
    hostName: 'Example Host',
    hostMdsId: 'MDSL1111AA',
    environment: fakeEnv('test'),
    connectorName: 'Example Connector 1',
    location: 'Germany, EU',
    frontendUrl: 'https://xample.test1/connector',
    endpointUrl: 'https://xample.test1/connector/api/dsp',
    managementUrl: 'https://xample.test1/connector/api/management',
    status: 'ONLINE',
  },
  {
    connectorId: 'MDSL1111AA.AP23H5W',
    type: ConnectorTypeDto.Own,
    orgName: 'Example Organization',
    orgMdsId: 'MDSL1111AA',
    hostName: 'Example Host',
    hostMdsId: 'MDSL1111AA',
    environment: fakeEnv('test'),
    connectorName: 'Example Connector 2',
    location: 'Germany, EU',
    frontendUrl: 'https://xample.test1/connector',
    endpointUrl: 'https://xample.test1/connector/api/dsp',
    managementUrl: 'https://xample.test1/connector/api/management',
    status: 'DEAD',
  },
  {
    connectorId: 'MDSL1111AA.AP42I3L',
    type: ConnectorTypeDto.Caas,
    orgName: 'Example Organization',
    orgMdsId: 'MDSL1111AA',
    hostName: 'Example Host',
    hostMdsId: 'MDSL1111AA',
    environment: fakeEnv('test'),
    connectorName: 'Example Connector 3',
    location: 'Germany, EU',
    frontendUrl: 'https://xample.test1/connector',
    endpointUrl: 'https://xample.test1/connector/api/dsp',
    managementUrl: 'https://xample.test1/connector/api/management',
    status: 'INIT',
  },
  {
    connectorId: 'MDSL1111AA.AP35I6Y',
    type: ConnectorTypeDto.Provided,
    orgName: 'Example Organization',
    orgMdsId: 'MDSL1111AA',
    hostName: 'Service Partner Organization',
    hostMdsId: 'MDSL7777AA',
    environment: fakeEnv('test'),
    connectorName: 'Provided Connector 1',
    location: 'Germany, EU',
    frontendUrl: 'https://xample.test1/connector',
    endpointUrl: 'https://xample.test1/connector/api/dsp',
    managementUrl: 'https://xample.test1/connector/api/management',
    status: 'ONLINE',
  },
  {
    connectorId: 'MDSL2222BB.CP59I8U',
    type: ConnectorTypeDto.Own,
    orgName: 'Example Organization',
    orgMdsId: 'MDSL2222BB',
    hostName: 'Example Host',
    hostMdsId: 'MDSL2222BB',
    environment: fakeEnv('test'),
    connectorName: 'Example Connector 1',
    location: 'Germany, EU',
    frontendUrl: 'https://xample.test1/connector',
    endpointUrl: 'https://xample.test1/connector/api/dsp',
    managementUrl: 'https://xample.test1/connector/api/management',
    status: 'ONLINE',
  },
  {
    connectorId: 'MDSL2222BB.CFIWWBD',
    type: ConnectorTypeDto.Own,
    orgMdsId: 'MDSL2222BB',
    orgName: 'Example Organization',
    hostMdsId: 'MDSL2222BB',
    hostName: 'Example Organization',
    environment: fakeEnv('test'),
    connectorName: 'Example Connector 2',
    location: 'Germany, EU',
    frontendUrl: 'https://xample.test2/connector',
    endpointUrl: 'https://xample.test2/connector/api/dsp',
    managementUrl: 'https://xample.test2/connector/api/management',
    status: 'ONLINE',
  },
  {
    connectorId: 'MDSL2222BB.CWAQ71U',
    orgMdsId: 'MDSL2222BB',
    orgName: 'Example Organization',
    hostMdsId: 'MDSL2222BB',
    hostName: 'Example Organization',
    type: ConnectorTypeDto.Own,
    environment: fakeEnv('test'),
    connectorName: 'Example Connector',
    location: 'Germany, EU',
    frontendUrl: 'https://xample.test3/connector',
    endpointUrl: 'https://xample.test3/connector/api/dsp',
    managementUrl: 'https://xample.test3/connector/api/management',
    status: 'OFFLINE',
  },
];

export const getListOfConnectorsForTable = (
  mdsId: string,
): ConnectorOverviewResult => {
  return {
    connectors: TEST_CONNECTORS.filter((c) => c.orgMdsId === mdsId).map((c) => {
      return {
        id: c.connectorId,
        hostName: c.hostName,
        type: c.type,
        environment: c.environment,
        name: c.connectorName,
        status: c.status,
        frontendUrl: c.frontendUrl,
      };
    }),
  };
};

export const listSpConnectors = (): ProvidedConnectorOverviewResult => {
  return {
    connectors: TEST_CONNECTORS.filter((c) => c.type === 'PROVIDED').map(
      (c): ProvidedConnectorOverviewEntryDto => {
        return {
          id: c.connectorId,
          customerOrgName: c.orgName,
          frontendUrl: c.frontendUrl,
          type: c.type,
          environment: c.environment,
          name: c.connectorName,
          status: c.status,
        };
      },
    ),
  };
};

export const getListOfOwnConnectorsForTable = (): ConnectorOverviewResult => {
  const mdsId = getUserInfo().organizationMdsId;
  return {
    connectors: TEST_CONNECTORS.filter((c) => c.orgMdsId === mdsId).map((c) => {
      return {
        id: c.connectorId,
        hostName: c.hostName,
        type: c.type,
        environment: c.environment,
        name: c.connectorName,
        status: c.status,
        frontendUrl: c.frontendUrl,
      };
    }),
  };
};

export const getOwnConnectorDetail = (
  connectorId: string,
): ConnectorDetailDto => {
  const mdsId = getUserInfo().organizationMdsId;
  return TEST_CONNECTORS.filter(
    (c) => c.orgMdsId === mdsId && c.connectorId === connectorId,
  )[0];
};

export const getListOfAllConnectorsForTable = (): ConnectorOverviewResult => {
  return {
    connectors: TEST_CONNECTORS.map((c) => {
      return {
        id: c.connectorId,
        hostName: c.hostName,
        type: c.type,
        environment: c.environment,
        name: c.connectorName,
        status: c.status,
        frontendUrl: c.frontendUrl,
      };
    }),
  };
};

export const getFullConnectorDetails = (
  mdsId: string | null,
  connectorId: string,
): ConnectorDetailDto => {
  return TEST_CONNECTORS.filter((c) => c.connectorId === connectorId)[0];
};

export const getProvidedConnectorDetails = (
  connectorId: string,
): ConnectorDetailDto => {
  return TEST_CONNECTORS.filter((c) => c.connectorId === connectorId)[0];
};

export const deleteProvidedConnector = (
  request: DeleteOwnConnectorRequest,
): IdResponse => {
  TEST_CONNECTORS = TEST_CONNECTORS.filter(
    (c) => c.connectorId !== request.connectorId,
  );

  return {id: request.connectorId, changedDate: new Date()};
};

export const createOwnConnector = (
  request: CreateConnectorRequest,
): CreateConnectorResponse => {
  const mdsId = getUserInfo().organizationMdsId;
  const orgName = getUserInfo().organizationName;
  const randomId = generateRandomId(mdsId);
  const status = 'OFFLINE';

  TEST_CONNECTORS.push({
    connectorId: randomId,
    orgMdsId: mdsId,
    orgName: orgName,
    hostMdsId: mdsId,
    hostName: orgName,
    type: ConnectorTypeDto.Own,
    environment: fakeEnv('test'),
    connectorName: request.name,
    location: request.location,
    frontendUrl: request.frontendUrl,
    endpointUrl: request.endpointUrl,
    managementUrl: request.managementUrl,
    status: status,
  });
  return {
    id: randomId,
    changedDate: new Date(),
    status: CreateConnectorStatusDto.Ok,
  };
};

export const createCaas = (
  request: CreateCaasRequest,
  environmentId: string,
): CreateConnectorResponse => {
  const mdsId = getUserInfo().organizationMdsId;
  const orgName = getUserInfo().organizationName;
  const randomId = generateRandomId(mdsId);
  const status = 'INIT';

  TEST_CONNECTORS.push({
    connectorId: randomId,
    orgMdsId: mdsId,
    orgName: orgName,
    hostMdsId: mdsId,
    hostName: orgName,
    type: ConnectorTypeDto.Caas,
    environment: fakeEnv(environmentId),
    connectorName: request.connectorTitle,
    location: 'Germany, EU',
    frontendUrl: `https://${request.connectorSubdomain}.sovity.caas/connector`,
    endpointUrl: `https://${request.connectorSubdomain}.sovity.caas/connector/api/dsp`,
    managementUrl: `https://${request.connectorSubdomain}.sovity.caas/connector/api/management`,
    status: status,
  });
  return {
    id: randomId,
    changedDate: new Date(),
    status: CreateConnectorStatusDto.Ok,
  };
};

export const checkFreeCaasUsage = (
  request: CheckFreeCaasUsageRequest,
): CaasAvailabilityResponse => {
  return {
    current: TEST_CONNECTORS.find(
      (x) =>
        x.type === ConnectorTypeDto.Caas &&
        x.environment.title === request.environmentId,
    )
      ? 1
      : 0,
    limit: 1,
  };
};

export const createProvidedConnector = (
  request: CreateConnectorRequest,
  clientMdsId: string,
): CreateConnectorResponse => {
  const hostMdsId = getUserInfo().organizationMdsId;
  const hostOrgName = getUserInfo().organizationName;
  const status = 'OFFLINE';

  const clientOrgName = TEST_ORGANIZATIONS.filter(
    (it) => it.mdsId === clientMdsId,
  )[0].name;

  const randomId = generateRandomId(clientMdsId);
  TEST_CONNECTORS.push({
    connectorId: randomId,
    orgMdsId: clientMdsId,
    orgName: clientOrgName,
    hostMdsId: hostMdsId,
    hostName: hostOrgName,
    type: ConnectorTypeDto.Provided,
    environment: fakeEnv('test'),
    connectorName: request.name,
    location: request.location,
    frontendUrl: request.frontendUrl,
    endpointUrl: request.endpointUrl,
    managementUrl: request.managementUrl,
    status: status,
  });
  return {
    id: randomId,
    changedDate: new Date(),
    status: CreateConnectorStatusDto.Ok,
  };
};

export const deleteOwnConnector = (
  request: DeleteOwnConnectorRequest,
): IdResponse => {
  TEST_CONNECTORS = TEST_CONNECTORS.filter(
    (c) => c.connectorId !== request.connectorId,
  );

  return {id: request.connectorId, changedDate: new Date()};
};

export const getNumberOfOrganizationConnectors = (mdsId: string): number => {
  return TEST_CONNECTORS.filter((connector) => connector.orgMdsId === mdsId)
    .length;
};

const generateRandomId = (mdsId: string): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  result = mdsId + '.' + result;

  // if such id exists, generate another one
  if (TEST_CONNECTORS.filter((c) => c.connectorId === result).length > 0) {
    return generateRandomId(mdsId);
  } else {
    return result;
  }
};
