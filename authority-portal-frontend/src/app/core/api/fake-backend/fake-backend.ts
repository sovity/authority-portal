import {
  CentralComponentCreateRequestFromJSON,
  CentralComponentDtoToJSON,
  ConnectorDetailDtoToJSON,
  ConnectorOverviewResultToJSON,
  CreateConnectorRequestFromJSON,
  CreateConnectorResponseToJSON,
  CreateOrganizationRequestFromJSON,
  DeploymentEnvironmentDtoToJSON,
  FetchAPI,
  IdResponseToJSON,
  InviteParticipantUserRequestFromJSON,
  OrganizationDetailsDtoToJSON,
  OrganizationOverviewResultToJSON,
  UserDetailDtoToJSON,
  UserInfoToJSON,
} from '@sovity.de/authority-portal-client';
import {
  centralComponentList,
  createCentralComponent,
  deleteCentralComponent,
} from './impl/central-component-fake';
import {deploymentEnvironmentList} from './impl/deployment-environment-list-fake';
import {
  createOwnConnector,
  createProvidedConnector,
  deleteOwnConnector,
  getFullConnectorDetails,
  getListOfAllConnectorsForTable,
  getListOfConnectorsForTable,
} from './impl/fake-connectors';
import {
  approveOrganization,
  getListOfOrganizationsForTable,
  getMyOrganizationDetails,
  getOrganizationDetails,
  rejectOrganization,
} from './impl/fake-organizations';
import {
  changeApplicationRole,
  changeParticipantRole,
  clearApplicationRole,
  getUserInfo,
  inviteUser,
  userDetails,
} from './impl/fake-users';
import {createOrganization} from './impl/registration-process-fake';
import {getBody, getMethod, getUrl} from './utils/request-utils';
import {ok} from './utils/response-utils';
import {UrlInterceptor} from './utils/url-interceptor';

export const AUTHORITY_PORTAL_FAKE_BACKEND: FetchAPI = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  const {url, queryParams} = getUrl(
    input,
    'http://authority-portal.fake-backend/api/',
  );
  const method = getMethod(init);
  const body = getBody(init);

  console.log(
    ...['Fake Backend:', method, url, queryParams.toString(), body].filter(
      (it) => !!it,
    ),
  );

  const environmentId = queryParams.get('environmentId');

  return new UrlInterceptor(url, method)

    .url('user-info')
    .on('GET', () => {
      const result = getUserInfo();
      return ok(UserInfoToJSON(result));
    })

    .url('organizations/my-org')
    .on('GET', (mdsId) => {
      const result = getMyOrganizationDetails();
      return ok(OrganizationDetailsDtoToJSON(result));
    })

    .url('organizations')
    .on('GET', () => {
      const result = getListOfOrganizationsForTable();
      return ok(OrganizationOverviewResultToJSON(result));
    })

    .url('authority/organizations/invite')
    .on('POST', () => {
      throw new Error('TODO');
    })

    .url('authority/organizations/*/connectors')
    .on('GET', (mdsId: string) => {
      const result = getListOfConnectorsForTable(mdsId);
      return ok(ConnectorOverviewResultToJSON(result));
    })

    .url('authority/organizations/*/approve')
    .on('PUT', (mdsId) => {
      const result = approveOrganization(mdsId);
      return ok(IdResponseToJSON(result));
    })

    .url('authority/organizations/*/reject')
    .on('PUT', (mdsId) => {
      const result = rejectOrganization(mdsId);
      return ok(IdResponseToJSON(result));
    })

    .url('authority/users/*/deactivate')
    .on('PUT', (userId) => {
      return ok(userId);
    })

    .url('authority/users/*/reactivate')
    .on('PUT', (userId) => {
      return ok(userId);
    })

    .url('authority/connectors')
    .on('GET', () => {
      const result = getListOfAllConnectorsForTable();
      return ok(ConnectorOverviewResultToJSON(result));
    })

    .url('authority/connectors/*')
    .on('GET', (connectorId: string) => {
      const result = getFullConnectorDetails(null, connectorId);
      return ok(ConnectorDetailDtoToJSON(result));
    })

    .url('organizations/my-org/connectors')
    .on('GET', () => {
      const mdsId = getUserInfo().organizationMdsId;
      const result = getListOfConnectorsForTable(mdsId);
      return ok(ConnectorOverviewResultToJSON(result));
    })

    .url('organizations/my-org/connectors/*')
    .on('GET', (connectorId: string) => {
      const mdsId = getUserInfo().organizationMdsId;
      const result = getFullConnectorDetails(mdsId, connectorId);
      return ok(ConnectorDetailDtoToJSON(result));
    })
    .on('DELETE', (connectorId: string) => {
      const result = deleteOwnConnector({connectorId});
      return ok(IdResponseToJSON(result));
    })

    .url('organizations/my-org/connectors/create-on-premise')
    .on('POST', () => {
      const request = CreateConnectorRequestFromJSON(body);
      const result = createOwnConnector(request);

      return ok(CreateConnectorResponseToJSON(result));
    })

    .url('organizations/my-org/users/invite')
    .on('POST', () => {
      const request = InviteParticipantUserRequestFromJSON(body);
      const result = inviteUser(request);

      return ok(IdResponseToJSON(result));
    })

    .url('organizations/my-org/users/*/role')
    .on('PUT', (userId: string) => {
      const result = changeParticipantRole({body: body, userId});

      return ok(IdResponseToJSON(result));
    })

    .url('authority/users/*/role')
    .on('PUT', (userId: string) => {
      const result = changeApplicationRole({body: body, userId});

      return ok(IdResponseToJSON(result));
    })

    .url('authority/users/*/role')
    .on('DELETE', (userId: string) => {
      const result = clearApplicationRole({userId});

      return ok(IdResponseToJSON(result));
    })

    .url('organizations/my-org/users/*/deactivate')
    .on('PUT', (userId) => {
      const result = approveOrganization(userId);
      return ok(IdResponseToJSON(result));
    })

    .url('organizations/my-org/users/*/reactivate')
    .on('PUT', (userId) => {
      const result = approveOrganization(userId);
      return ok(IdResponseToJSON(result));
    })

    .url('organizations/my-org/users/*/deactivate')
    .on('PUT', (userId) => {
      throw new Error('TODO');
    })

    .url('organizations/my-org/users/*/reactivate')
    .on('PUT', (userId) => {
      throw new Error('TODO');
    })

    .url('organizations/*/connectors/*')
    .on('GET', (mdsId: string, connectorId: string) => {
      const result = getFullConnectorDetails(mdsId, connectorId);
      return ok(ConnectorDetailDtoToJSON(result));
    })
    .on('DELETE', (mdsId, connectorId) => {
      throw new Error('TODO');
    })

    .url('organizations/*/connectors/create-service-provided')
    .on('POST', (clientMdsId) => {
      const request = CreateConnectorRequestFromJSON(body);
      const result = createProvidedConnector(request, clientMdsId);
      return ok(CreateConnectorResponseToJSON(result));
    })

    .url('registration/organization')
    .on('POST', () => {
      const request = CreateOrganizationRequestFromJSON(body);
      const result = createOrganization(request);
      return ok(IdResponseToJSON(result));
    })

    .url('users/*')
    .on('GET', (userId) => {
      const result = userDetails(userId);
      return ok(UserDetailDtoToJSON(result));
    })

    .url('deployment-environments')
    .on('GET', () => {
      const result = deploymentEnvironmentList();
      return ok(result.map(DeploymentEnvironmentDtoToJSON));
    })

    .url('authority/central-components')
    .on('GET', () => {
      const result = centralComponentList(environmentId!);
      return ok(result.map(CentralComponentDtoToJSON));
    })
    .on('POST', () => {
      const request = CentralComponentCreateRequestFromJSON(body);
      const result = createCentralComponent(request, environmentId!);
      return ok(IdResponseToJSON(result));
    })

    .url('authority/central-components/*')
    .on('DELETE', (centralComponentId) => {
      const result = deleteCentralComponent(centralComponentId);
      return ok(IdResponseToJSON(result));
    })

    .url('organizations/*')
    .on('GET', (mdsId) => {
      const result = getOrganizationDetails(mdsId);
      return ok(OrganizationDetailsDtoToJSON(result));
    })

    .tryMatch();
};
