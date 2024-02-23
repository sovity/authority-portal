import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {
  CaasAvailabilityResponse,
  CentralComponentCreateRequest,
  CentralComponentDto,
  ChangeApplicationRoleRequest,
  ChangeParticipantRoleRequest,
  ClearApplicationRoleRequest,
  ConnectorDetailDto,
  ConnectorOverviewResult,
  CreateCaasRequest,
  CreateConnectorRequest,
  CreateConnectorResponse,
  DeploymentEnvironmentDto,
  IdResponse,
  InviteOrganizationRequest,
  InviteParticipantUserRequest,
  OnboardingOrganizationUpdateDto,
  OnboardingUserUpdateDto,
  OrganizationDetailsDto,
  OrganizationOverviewResult,
  OwnOrganizationDetailsDto,
  ProvidedConnectorOverviewResult,
  RegistrationRequestDto,
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

  updateApplicationUserRoles(request: ChangeApplicationRoleRequest) {
    return from(this.api().changeApplicationRole(request));
  }

  clearApplicationRole(request: ClearApplicationRoleRequest) {
    return from(this.api().clearApplicationRole(request));
  }

  deactivateAnyUser(userId: string) {
    return from(this.api().deactivateAnyUser({userId}));
  }

  deactivateUser(userId: string) {
    return from(this.api().deactivateParticipantUser({userId}));
  }

  checkUserDeletion(userId: string) {
    return from(this.api().checkUserDeletion({userId}));
  }

  deleteUser(userId: string, successorUserId?: string) {
    return from(this.api().deleteUser({userId, successorUserId}));
  }

  checkParticipantUserDeletion(userId: string) {
    return from(this.api().checkParticipantUserDeletion({userId}));
  }

  deleteParticipantUser(userId: string, successorUserId?: string) {
    return from(this.api().deleteParticipantUser({userId, successorUserId}));
  }

  reactivateAnyUser(userId: string) {
    return from(this.api().reactivateAnyUser({userId}));
  }

  reactivateUser(userId: string) {
    return from(this.api().reactivateParticipantUser({userId}));
  }

  getUserDetailDto(userId: string): Observable<UserDetailDto> {
    return from(this.api().userDetails({userId}));
  }

  registerOrganization(
    registrationRequestDto: RegistrationRequestDto,
  ): Observable<IdResponse> {
    return from(this.api().registerUser({registrationRequestDto}));
  }

  getOrganizationsForAuthority(
    environmentId: string,
  ): Observable<OrganizationOverviewResult> {
    return from(this.api().organizationsOverviewForAuthority({environmentId}));
  }

  getOrganizationDetailsForAuthority(
    mdsId: string,
    environmentId: string,
  ): Observable<OrganizationDetailsDto> {
    return from(
      this.api().organizationDetailsForAuthority({mdsId, environmentId}),
    );
  }

  getOrganizationsForApplicationRoles(
    environmentId: string,
  ): Observable<OrganizationOverviewResult> {
    return from(this.api().organizationsOverview({environmentId}));
  }

  getOrganizationDetailsForApplicationRoles(
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

  // All Connectors
  getAllConnectors(
    environmentId: string,
  ): Observable<ConnectorOverviewResult> {
    return from(this.api().getAllConnectors({environmentId}));
  }

  getAuthorityConnector(connectorId: string): Observable<ConnectorDetailDto> {
    return from(this.api().getAuthorityConnector({connectorId}));
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
  ): Observable<CreateConnectorResponse> {
    return from(
      this.api().createOwnConnector({createConnectorRequest, environmentId}),
    );
  }

  createProvidedConnector(
    connector: CreateConnectorRequest,
    mdsId: string,
    environmentId: string,
  ): Observable<CreateConnectorResponse> {
    return from(
      this.api().createProvidedConnector({
        createConnectorRequest: connector,
        mdsId,
        environmentId,
      }),
    );
  }

  createCaas(
    createCaasRequest: CreateCaasRequest,
    environmentId: string,
  ): Observable<CreateConnectorResponse> {
    return from(this.api().createCaas({createCaasRequest, environmentId}));
  }

  deleteOwnConnector(connectorId: string): Observable<IdResponse> {
    return from(this.api().deleteOwnConnector({connectorId}));
  }

  getProvidedConnectors(
    environmentId: string,
  ): Observable<ProvidedConnectorOverviewResult> {
    return from(this.api().getProvidedConnectors({environmentId}));
  }

  getProvidedConnectorDetails(
    connectorId: string,
  ): Observable<ConnectorDetailDto> {
    return from(this.api().getProvidedConnectorDetails({connectorId}));
  }

  deleteProvidedConnector(connectorId: string): Observable<IdResponse> {
    return from(this.api().deleteProvidedConnector({connectorId}));
  }

  inviteUser(request: InviteParticipantUserRequest): Observable<IdResponse> {
    return from(this.api().inviteUser({inviteParticipantUserRequest: request}));
  }

  getDeploymentEnvironments(): Observable<DeploymentEnvironmentDto[]> {
    return from(this.api().deploymentEnvironmentList());
  }

  onboardingUser(request: OnboardingUserUpdateDto) {
    return from(
      this.api().updateOnboardingUser({onboardingUserUpdateDto: request}),
    );
  }

  onboardingOrganization(request: OnboardingOrganizationUpdateDto) {
    return from(
      this.api().updateOnboardingOrganization({
        onboardingOrganizationUpdateDto: request,
      }),
    );
  }

  getCentralComponents(
    environmentId: string,
  ): Observable<CentralComponentDto[]> {
    return from(this.api().getCentralComponents({environmentId}));
  }

  createCentralComponent(
    environmentId: string,
    centralComponentCreateRequest: CentralComponentCreateRequest,
  ): Observable<IdResponse> {
    return from(
      this.api().createCentralComponent({
        environmentId,
        centralComponentCreateRequest,
      }),
    );
  }

  deleteCentralComponent(centralComponentId: string): Observable<IdResponse> {
    return from(
      this.api().deleteCentralComponent({
        centralComponentId,
      }),
    );
  }

  checkFreeCaasUsage(
    environmentId: string,
  ): Observable<CaasAvailabilityResponse> {
    return from(this.api().checkFreeCaasUsage({environmentId}));
  }

  private api(): UiApi {
    return this.apiClientFactory.newAuthorityPortalClient().uiApi;
  }
}
