import {
  ConnectorDetailDto,
  ConnectorOverviewResult,
  ConnectorTypeDto,
  CreateConnectorRequest,
  CreateConnectorResponse,
  CreateConnectorStatusDto,
  DeleteOwnConnectorRequest,
  IdResponse,
} from '@sovity.de/authority-portal-client';
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
    environment: {environmentId: '123', title: 'test'},
    connectorName: 'Example Connector 1',
    location: 'Germany, EU',
    url: 'https://xample.test1/connector',
  },
  {
    connectorId: 'MDSL2222BB.CP59I8U',
    type: ConnectorTypeDto.Own,
    orgName: 'Example Organization',
    orgMdsId: 'MDSL2222BB',
    hostName: 'Example Host',
    hostMdsId: 'MDSL2222BB',
    environment: {environmentId: '123', title: 'test'},
    connectorName: 'Example Connector 1',
    location: 'Germany, EU',
    url: 'https://xample.test1/connector',
  },
  {
    connectorId: 'MDSL2222BB.CFIWWBD',
    type: ConnectorTypeDto.Own,
    orgMdsId: 'MDSL2222BB',
    orgName: 'Example Organization',
    hostMdsId: 'MDSL2222BB',
    hostName: 'Example Organization',
    environment: {environmentId: '123', title: 'test'},
    connectorName: 'Example Connector 2',
    location: 'Germany, EU',
    url: 'https://xample.test2/connector',
  },
  {
    connectorId: 'MDSL2222BB.CWAQ71U',
    orgMdsId: 'MDSL2222BB',
    orgName: 'Example Organization',
    hostMdsId: 'MDSL2222BB',
    hostName: 'Example Organization',
    type: ConnectorTypeDto.Own,
    environment: {environmentId: '123', title: 'test'},
    connectorName: 'Example Connector',
    location: 'Germany, EU',
    url: 'https://xample.test3/connector',
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
      };
    }),
  };
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

export const createOwnConnector = (
  request: CreateConnectorRequest,
): CreateConnectorResponse => {
  const mdsId = getUserInfo().organizationMdsId;
  const orgName = getUserInfo().organizationName;
  const randomId = generateRandomId(mdsId);

  TEST_CONNECTORS.push({
    connectorId: randomId,
    orgMdsId: mdsId,
    orgName: orgName,
    hostMdsId: mdsId,
    hostName: orgName,
    type: ConnectorTypeDto.Own,
    environment: {environmentId: '123', title: 'test'},
    connectorName: request.name,
    location: request.location,
    url: request.url,
  });
  return {
    id: randomId,
    changedDate: new Date(),
    status: CreateConnectorStatusDto.Ok,
  };
};

export const createProvidedConnector = (
  request: CreateConnectorRequest,
  clientMdsId: string,
): CreateConnectorResponse => {
  const hostMdsId = getUserInfo().organizationMdsId;
  const hostOrgName = getUserInfo().organizationName;

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
    environment: {environmentId: '123', title: 'test'},
    connectorName: request.name,
    location: request.location,
    url: request.url,
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
