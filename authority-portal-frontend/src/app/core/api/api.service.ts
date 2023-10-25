import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {
  ConnectorDetailDto,
  ConnectorOverviewResult,
  CreateConnectorRequest,
  CreateOrganizationRequest,
  IdResponse,
  InviteParticipantUserRequest,
  OrganizationDetailsDto,
  OrganizationOverviewResult,
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

  getOrganizationDetails(mdsId: string): Observable<OrganizationDetailsDto> {
    return from(this.api().organizationDetails({mdsId}));
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
  getOwnOrganizationConnectors(): Observable<ConnectorOverviewResult> {
    return from(this.api().ownOrganizationConnectors());
  }

  getOwnOrganizationConnectorDetails(
    connectorId: string,
  ): Observable<ConnectorDetailDto> {
    return from(this.api().ownOrganizationConnectorDetails({connectorId}));
  }

  createOwnConnector(
    createConnectorRequest: CreateConnectorRequest,
  ): Observable<IdResponse> {
    return from(this.api().createOwnConnector({createConnectorRequest}));
  }

  createProvidedConnector(
    connector: CreateConnectorRequest,
    mdsId: string,
  ): Observable<IdResponse> {
    return from(
      this.api().createProvidedConnector({
        createConnectorRequest: connector,
        mdsId,
      }),
    );
  }

  inviteUser(request: InviteParticipantUserRequest): Observable<IdResponse> {
    return from(this.api().inviteUser({inviteParticipantUserRequest: request}));
  }

  private api(): UiApi {
    return this.apiClientFactory.newAuthorityPortalClient().uiApi;
  }
}
