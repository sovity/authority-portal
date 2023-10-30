import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {
  ConnectorDetailDto,
  ConnectorOverviewResult,
  CreateConnectorRequest,
  CreateOrganizationRequest,
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
    environmentId?: string,
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
    environmentId?: string,
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
    environmentId?: string,
  ): Observable<IdResponse> {
    return from(
      this.api().createOwnConnector({createConnectorRequest, environmentId}),
    );
  }

  createProvidedConnector(
    connector: CreateConnectorRequest,
    mdsId: string,
    environmentId?: string,
  ): Observable<IdResponse> {
    return from(
      this.api().createProvidedConnector({
        createConnectorRequest: connector,
        mdsId,
        environmentId,
      }),
    );
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
