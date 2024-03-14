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
  CaasAvailabilityResponseToJSON,
  CentralComponentCreateRequestFromJSON,
  CentralComponentDtoToJSON,
  ComponentStatusOverviewToJSON,
  ConnectorDetailDtoToJSON,
  ConnectorOverviewResultToJSON,
  CreateCaasRequestFromJSON,
  CreateConnectorRequestFromJSON,
  CreateConnectorResponseToJSON,
  DeploymentEnvironmentDtoToJSON,
  FetchAPI,
  IdResponseToJSON,
  InviteOrganizationRequestFromJSON,
  InviteParticipantUserRequestFromJSON,
  OnboardingOrganizationUpdateDtoFromJSON,
  OnboardingUserUpdateDtoFromJSON,
  OrganizationDetailsDtoToJSON,
  OrganizationOverviewResultToJSON,
  OwnOrganizationDetailsDtoToJSON,
  ProvidedConnectorOverviewResultToJSON,
  RegistrationRequestDtoFromJSON,
  UpdateOrganizationDtoFromJSON,
  UpdateUserDtoFromJSON,
  UserDeletionCheckToJSON,
  UserDetailDtoToJSON,
  UserInfoToJSON,
} from '@sovity.de/authority-portal-client';
import {
  centralComponentList,
  createCentralComponent,
  deleteCentralComponent,
} from './impl/central-component-fake';
import {deploymentEnvironmentList} from './impl/deployment-environment-list-fake';
import {getComponentStatus} from './impl/fake-component-statuses';
import {
  checkFreeCaasUsage,
  createCaas,
  createOwnConnector,
  createProvidedConnector,
  deleteOwnConnector,
  deleteProvidedConnector,
  getFullConnectorDetails,
  getListOfAllConnectorsForTable,
  getListOfConnectorsForTable,
  getListOfOwnConnectorsForTable,
  getOwnConnectorDetail,
  getProvidedConnectorDetails,
  listSpConnectors,
} from './impl/fake-connectors';
import {
  approveOrganization,
  getListOfOrganizationsForTable,
  getOrganizationDetails,
  getOwnOrganizationDetails,
  inviteOrganization,
  onboardOrganization,
  rejectOrganization,
  updateOwnOrganization,
} from './impl/fake-organizations';
import {
  cascadeDeleteUser,
  changeApplicationRole,
  changeParticipantRole,
  checkUserDeletion,
  clearApplicationRole,
  deactivateUser,
  getUserInfo,
  getUserOrThrow,
  inviteUser,
  onboardUser,
  reactivateUser,
  updateUser,
} from './impl/fake-users';
import {
  createOrganization,
  registerOrganization,
} from './impl/registration-process-fake';
import {getBody, getMethod, getUrl} from './utils/request-utils';
import {buildOkFn} from './utils/response-utils';
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
  const environmentId = queryParams.get('environmentId');

  const ok = buildOkFn(method, url, queryParams, body);

  return new UrlInterceptor(url, method)

    .url('user-info')
    .on('GET', () => {
      const result = getUserInfo();
      return ok(UserInfoToJSON(result), false);
    })

    .url('authority/organizations')
    .on('GET', () => {
      const result = getListOfOrganizationsForTable();
      return ok(OrganizationOverviewResultToJSON(result));
    })

    .url('authority/organizations/invite')
    .on('POST', () => {
      const request = InviteOrganizationRequestFromJSON(body);
      const result = inviteOrganization(request);

      return ok(IdResponseToJSON(result));
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

    .url('authority/organizations/*')
    .on('GET', (mdsId) => {
      const result = getOrganizationDetails(mdsId);
      return ok(OrganizationDetailsDtoToJSON(result));
    })

    .url('authority/users/*/deactivate')
    .on('PUT', (userId) => {
      return ok(userId);
    })

    .url('authority/users/*/reactivate')
    .on('PUT', (userId) => {
      return ok(userId);
    })

    .url('authority/users/*/check-delete')
    .on('GET', (userId) => {
      const userDeletionCheck = checkUserDeletion(userId);
      return ok(UserDeletionCheckToJSON(userDeletionCheck));
    })

    .url('authority/users/*')
    .on('DELETE', (userId) => {
      const successorUserId = queryParams.get('successorUserId');
      return ok(IdResponseToJSON(cascadeDeleteUser(userId, successorUserId)));
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
      const result = getListOfOwnConnectorsForTable();
      return ok(ConnectorOverviewResultToJSON(result));
    })

    .url('organizations/my-org/connectors/create-on-premise')
    .on('POST', () => {
      const request = CreateConnectorRequestFromJSON(body);
      const result = createOwnConnector(request);

      return ok(CreateConnectorResponseToJSON(result));
    })

    .url('organizations/my-org/connectors/request-caas')
    .on('POST', () => {
      const request = CreateCaasRequestFromJSON(body);
      const result = createCaas(request, environmentId!);

      return ok(CreateConnectorResponseToJSON(result));
    })

    .url('organizations/my-org/connectors/check-free-caas-usage')
    .on('GET', () => {
      const result = checkFreeCaasUsage({environmentId: environmentId!});

      return ok(CaasAvailabilityResponseToJSON(result));
    })

    .url('organizations/my-org/connectors/*')
    .on('GET', (connectorId: string) => {
      const result = getOwnConnectorDetail(connectorId);
      return ok(ConnectorDetailDtoToJSON(result));
    })
    .on('DELETE', (connectorId: string) => {
      const result = deleteOwnConnector({connectorId});
      return ok(IdResponseToJSON(result));
    })

    .url('application/connectors')
    .on('GET', () => {
      const result = listSpConnectors();
      return ok(ProvidedConnectorOverviewResultToJSON(result));
    })

    .url('application/connectors/*')
    .on('GET', (connectorId: string) => {
      const result = getProvidedConnectorDetails(connectorId);
      return ok(ConnectorDetailDtoToJSON(result));
    })
    .on('DELETE', (connectorId: string) => {
      const result = deleteProvidedConnector({connectorId});
      return ok(IdResponseToJSON(result));
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
      const result = deactivateUser(userId);
      return ok(IdResponseToJSON(result));
    })

    .url('organizations/my-org/users/*/reactivate')
    .on('PUT', (userId) => {
      const result = reactivateUser(userId);
      return ok(IdResponseToJSON(result));
    })

    .url('organizations/my-org/users/*/deactivate')
    .on('PUT', (userId) => {
      const result = deactivateUser(userId);
      return ok(IdResponseToJSON(result));
    })

    .url('organizations/my-org/users/*/reactivate')
    .on('PUT', (userId) => {
      const result = reactivateUser(userId);
      return ok(IdResponseToJSON(result));
    })

    .url('users/*/check-delete')
    .on('GET', (userId) => {
      const userDeletionCheck = checkUserDeletion(userId);
      return ok(UserDeletionCheckToJSON(userDeletionCheck));
    })

    .url('users/*')
    .on('DELETE', (userId) => {
      const successorUserId = queryParams.get('successorUserId');
      return ok(IdResponseToJSON(cascadeDeleteUser(userId, successorUserId)));
    })

    .url('organizations/*/connectors/*')
    .on('GET', (mdsId: string, connectorId: string) => {
      const result = getFullConnectorDetails(mdsId, connectorId);
      return ok(ConnectorDetailDtoToJSON(result));
    })
    .on('DELETE', (mdsId, connectorId) => {
      throw new Error('TODO');
    })

    .url('registration/organization')
    .on('POST', () => {
      const request = RegistrationRequestDtoFromJSON(body);
      const result = createOrganization(request);
      return ok(IdResponseToJSON(result));
    })

    .url('registration')
    .on('POST', () => {
      const request = RegistrationRequestDtoFromJSON(body);
      const result = registerOrganization(request);
      return ok(IdResponseToJSON(result));
    })

    .url('registration')
    .on('POST', () => {
      const request = RegistrationRequestDtoFromJSON(body);
      const result = registerOrganization(request);
      return ok(IdResponseToJSON(result));
    })

    .url('users/*')
    .on('GET', (userId) => {
      const result = getUserOrThrow(userId);
      return ok(UserDetailDtoToJSON(result));
    })
    .on('PUT', (userId) => {
      const request = UpdateUserDtoFromJSON(body);
      const result = updateUser(userId, request);
      return ok(IdResponseToJSON(result));
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

    .url('organizations/my-org')
    .on('GET', () => {
      const result = getOwnOrganizationDetails();
      return ok(OwnOrganizationDetailsDtoToJSON(result));
    })
    .on('PUT', () => {
      const request = UpdateOrganizationDtoFromJSON(body);
      const result = updateOwnOrganization(request);
      return ok(IdResponseToJSON(result));
    })

    .url('application/organizations')
    .on('GET', () => {
      const result = getListOfOrganizationsForTable();
      return ok(OrganizationOverviewResultToJSON(result));
    })

    .url('application/organizations/*')
    .on('GET', () => {
      const result = getListOfOrganizationsForTable();
      return ok(OrganizationOverviewResultToJSON(result));
    })

    .url('registration/me/update')
    .on('POST', () => {
      const request = OnboardingUserUpdateDtoFromJSON(body);
      const result = onboardUser(request);

      return ok(IdResponseToJSON(result));
    })

    .url('registration/my-org/update')
    .on('POST', () => {
      const request = OnboardingOrganizationUpdateDtoFromJSON(body);
      const result = onboardOrganization(request);

      return ok(IdResponseToJSON(result));
    })

    .url('component-statuses')
    .on('GET', () => {
      const result = getComponentStatus(environmentId!);
      return ok(ComponentStatusOverviewToJSON(result));
    })

    .url('organizations/*/connectors/create-service-provided')
    .on('POST', (mdsId) => {
      const request = CreateConnectorRequestFromJSON(body);
      const result = createProvidedConnector(request, mdsId);
      return ok(CreateConnectorResponseToJSON(result));
    })
    .tryMatch();
};
