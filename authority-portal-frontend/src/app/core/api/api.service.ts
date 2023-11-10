import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {
  ChangeAuthorityRoleRequest,
  ChangeParticipantRoleRequest,
  ConnectorDetailDto,
  ConnectorOverviewResult,
  CreateConnectorRequest,
  CreateOrganizationRequest,
  CreateProvidedConnectorRequest,
  DeploymentEnvironmentDto,
  IdResponse,
  InviteOrganizationRequest,
  InviteParticipantUserRequest,
  OrganizationDetailsDto,
  OrganizationOverviewResult,
  OwnOrganizationDetailsDto,
  UiApi,
  UserDetailDto,
  UserInfo,
} from '@sovity.de/authority-portal-client';
import {ApiClientFactory} from './api-client-factory';

@Injectable()
export class ApiService {
  constructor(private apiClientFactory: ApiClientFactory) {}

  userProfile(): Observable<UserInfo> {
    return from(this.api().userInfo());
  }

  updateUserRoles(request: ChangeParticipantRoleRequest) {
    return from(this.api().changeParticipantRole(request));
  }

  deactivateAnyUser(userId: string) {
    return from(this.api().deactivateAnyUser({userId}));
  }

  deactivateUser(userId: string) {
    return from(this.api().deactivateParticipantUser({userId}));
  }

  reactivateAnyUser(userId: string) {
    return from(this.api().reactivateAnyUser({userId}));
  }

  reactivateUser(userId: string) {
    return from(this.api().reactivateParticipantUser({userId}));
  }

  updateAuthorityUserRoles(request: ChangeAuthorityRoleRequest) {
    return from(this.api().changeAuthorityRole(request));
  }

  getUserDetailDto(userId: string): Observable<UserDetailDto> {
    return from(this.api().userDetails({userId}));
  }

  createOrganization(
    createOrganizationRequest: CreateOrganizationRequest,
  ): Observable<IdResponse> {
    return from(this.api().createOrganization({createOrganizationRequest}));
  }

  getOrganizations(): Observable<OrganizationOverviewResult> {
    return from(this.api().organizationsOverview());
  }

  getOrganizationDetails(
    mdsId: string,
    environmentId: string,
  ): Observable<OrganizationDetailsDto> {
    return from(this.api().organizationDetails({mdsId, environmentId}));
  }

  getMyOrganizationDetails(): Observable<OwnOrganizationDetailsDto> {
    return from(this.api().ownOrganizationDetails());
  }

  getOrganizationUser(userId: string): Observable<UserDetailDto> {
    return from(this.api().userDetails({userId}));
  }

  approveOrganization(mdsId: string): Observable<IdResponse> {
    return from(this.api().approveOrganization({mdsId}));
  }

  rejectOrganization(mdsId: string): Observable<IdResponse> {
    return from(this.api().rejectOrganization({mdsId}));
  }

  // Connectors
  // Own Connectors
  getOwnOrganizationConnectors(
    environmentId: string,
  ): Observable<ConnectorOverviewResult> {
    return from(this.api().ownOrganizationConnectors({environmentId}));
  }

  getOwnOrganizationConnectorDetails(
    connectorId: string,
  ): Observable<ConnectorDetailDto> {
    return from(this.api().ownOrganizationConnectorDetails({connectorId}));
  }

  inviteOrganization(
    request: InviteOrganizationRequest,
  ): Observable<IdResponse> {
    return from(
      this.api().inviteOrganization({inviteOrganizationRequest: request}),
    );
  }

  createOwnConnector(
    createConnectorRequest: CreateConnectorRequest,
    environmentId: string,
  ): Observable<IdResponse> {
    return from(
      this.api().createOwnConnector({createConnectorRequest, environmentId}),
    );
  }

  createProvidedConnector(
    connector: CreateProvidedConnectorRequest,
  ): Observable<IdResponse> {
    return from(
      this.api().createProvidedConnector({
        createConnectorRequest: connector.createConnectorRequest,
        environmentId: connector.environmentId,
        mdsId: connector.mdsId,
      }),
    );
  }

  deleteOwnConnector(connectorId: string): Observable<IdResponse> {
    return from(this.api().deleteOwnConnector({connectorId}));
  }

  inviteUser(request: InviteParticipantUserRequest): Observable<IdResponse> {
    return from(this.api().inviteUser({inviteParticipantUserRequest: request}));
  }

  getDeploymentEnvironments(): Observable<DeploymentEnvironmentDto[]> {
    return from(this.api().deploymentEnvironmentList());
  }

  private api(): UiApi {
    return this.apiClientFactory.newAuthorityPortalClient().uiApi;
  }
}
