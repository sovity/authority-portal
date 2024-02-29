import {Injectable} from '@angular/core';
import {Observable, defer, from} from 'rxjs';
import {
  CaasAvailabilityResponse,
  CentralComponentCreateRequest,
  CentralComponentDto,
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
  UpdateOrganizationDto,
  UpdateUserDto,
  UserDetailDto,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {ApiClientFactory} from './api-client-factory';

@Injectable()
export class ApiService {
  constructor(private apiClientFactory: ApiClientFactory) {}

  userProfile(): Observable<UserInfo> {
    return this.toObservable(() => this.api().userInfo());
  }

  updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Observable<IdResponse> {
    return this.toObservable(() =>
      this.api().updateUser({userId, updateUserDto}),
    );
  }

  updateParticipantRole(userId: string, role: UserRoleDto) {
    return this.toObservable(() =>
      this.api().changeParticipantRole({userId, body: role}),
    );
  }
  updateApplicationRole(userId: string, role: UserRoleDto) {
    return this.toObservable(() =>
      this.api().changeApplicationRole({userId, body: role as UserRoleDto}),
    );
  }

  clearApplicationRole(userId: string) {
    return this.toObservable(() => this.api().clearApplicationRole({userId}));
  }

  deactivateAnyUser(userId: string) {
    return this.toObservable(() => this.api().deactivateAnyUser({userId}));
  }

  deactivateUser(userId: string) {
    return this.toObservable(() =>
      this.api().deactivateParticipantUser({userId}),
    );
  }

  checkUserDeletion(userId: string) {
    return this.toObservable(() => this.api().checkUserDeletion({userId}));
  }

  deleteUser(userId: string, successorUserId?: string) {
    return this.toObservable(() =>
      this.api().deleteUser({userId, successorUserId}),
    );
  }

  checkParticipantUserDeletion(userId: string) {
    return this.toObservable(() => this.api().checkUserDeletion({userId}));
  }

  deleteParticipantUser(userId: string, successorUserId?: string) {
    return this.toObservable(() =>
      this.api().deleteUser({userId, successorUserId}),
    );
  }

  reactivateAnyUser(userId: string) {
    return this.toObservable(() => this.api().reactivateAnyUser({userId}));
  }

  reactivateUser(userId: string) {
    return this.toObservable(() =>
      this.api().reactivateParticipantUser({userId}),
    );
  }

  getUserDetailDto(userId: string): Observable<UserDetailDto> {
    return this.toObservable(() => this.api().userDetails({userId}));
  }

  registerOrganization(
    registrationRequestDto: RegistrationRequestDto,
  ): Observable<IdResponse> {
    return this.toObservable(() =>
      this.api().registerUser({registrationRequestDto}),
    );
  }

  getOrganizationsForAuthority(
    environmentId: string,
  ): Observable<OrganizationOverviewResult> {
    return this.toObservable(() =>
      this.api().organizationsOverviewForAuthority({environmentId}),
    );
  }

  getOrganizationDetailsForAuthority(
    mdsId: string,
    environmentId: string,
  ): Observable<OrganizationDetailsDto> {
    return this.toObservable(() =>
      this.api().organizationDetailsForAuthority({mdsId, environmentId}),
    );
  }

  getOrganizationsForApplicationRoles(
    environmentId: string,
  ): Observable<OrganizationOverviewResult> {
    return this.toObservable(() =>
      this.api().organizationsOverview({environmentId}),
    );
  }

  getOrganizationDetailsForApplicationRoles(
    mdsId: string,
    environmentId: string,
  ): Observable<OrganizationDetailsDto> {
    return this.toObservable(() =>
      this.api().organizationDetails({mdsId, environmentId}),
    );
  }

  getOwnOrganizationDetails(): Observable<OwnOrganizationDetailsDto> {
    return this.toObservable(() => this.api().ownOrganizationDetails());
  }

  updateOwnOrganizationDetails(
    updateOrganizationDto: UpdateOrganizationDto,
  ): Observable<IdResponse> {
    return this.toObservable(() =>
      this.api().updateOwnOrganizationDetails({updateOrganizationDto}),
    );
  }

  getOrganizationUser(userId: string): Observable<UserDetailDto> {
    return this.toObservable(() => this.api().userDetails({userId}));
  }

  approveOrganization(mdsId: string): Observable<IdResponse> {
    return this.toObservable(() => this.api().approveOrganization({mdsId}));
  }

  rejectOrganization(mdsId: string): Observable<IdResponse> {
    return this.toObservable(() => this.api().rejectOrganization({mdsId}));
  }

  // Connectors
  // Own Connectors
  getOwnOrganizationConnectors(
    environmentId: string,
  ): Observable<ConnectorOverviewResult> {
    return this.toObservable(() =>
      this.api().ownOrganizationConnectors({environmentId}),
    );
  }

  // All Connectors
  getAllConnectors(environmentId: string): Observable<ConnectorOverviewResult> {
    return this.toObservable(() =>
      this.api().getAllConnectors({environmentId}),
    );
  }

  getAuthorityConnector(connectorId: string): Observable<ConnectorDetailDto> {
    return this.toObservable(() =>
      this.api().getAuthorityConnector({connectorId}),
    );
  }

  getOwnOrganizationConnectorDetails(
    connectorId: string,
  ): Observable<ConnectorDetailDto> {
    return this.toObservable(() =>
      this.api().ownOrganizationConnectorDetails({connectorId}),
    );
  }

  inviteOrganization(
    request: InviteOrganizationRequest,
  ): Observable<IdResponse> {
    return this.toObservable(() =>
      this.api().inviteOrganization({inviteOrganizationRequest: request}),
    );
  }

  createOwnConnector(
    createConnectorRequest: CreateConnectorRequest,
    environmentId: string,
  ): Observable<CreateConnectorResponse> {
    return this.toObservable(() =>
      this.api().createOwnConnector({createConnectorRequest, environmentId}),
    );
  }

  createProvidedConnector(
    connector: CreateConnectorRequest,
    mdsId: string,
    environmentId: string,
  ): Observable<CreateConnectorResponse> {
    return this.toObservable(() =>
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
    return this.toObservable(() =>
      this.api().createCaas({createCaasRequest, environmentId}),
    );
  }

  deleteOwnConnector(connectorId: string): Observable<IdResponse> {
    return this.toObservable(() =>
      this.api().deleteOwnConnector({connectorId}),
    );
  }

  getProvidedConnectors(
    environmentId: string,
  ): Observable<ProvidedConnectorOverviewResult> {
    return this.toObservable(() =>
      this.api().getProvidedConnectors({environmentId}),
    );
  }

  getProvidedConnectorDetails(
    connectorId: string,
  ): Observable<ConnectorDetailDto> {
    return this.toObservable(() =>
      this.api().getProvidedConnectorDetails({connectorId}),
    );
  }

  deleteProvidedConnector(connectorId: string): Observable<IdResponse> {
    return this.toObservable(() =>
      this.api().deleteProvidedConnector({connectorId}),
    );
  }

  inviteUser(request: InviteParticipantUserRequest): Observable<IdResponse> {
    return this.toObservable(() =>
      this.api().inviteUser({inviteParticipantUserRequest: request}),
    );
  }

  getDeploymentEnvironments(): Observable<DeploymentEnvironmentDto[]> {
    return this.toObservable(() => this.api().deploymentEnvironmentList());
  }

  onboardingUser(request: OnboardingUserUpdateDto) {
    return this.toObservable(() =>
      this.api().updateOnboardingUser({onboardingUserUpdateDto: request}),
    );
  }

  onboardingOrganization(request: OnboardingOrganizationUpdateDto) {
    return this.toObservable(() =>
      this.api().updateOnboardingOrganization({
        onboardingOrganizationUpdateDto: request,
      }),
    );
  }

  getCentralComponents(
    environmentId: string,
  ): Observable<CentralComponentDto[]> {
    return this.toObservable(() =>
      this.api().getCentralComponents({environmentId}),
    );
  }

  createCentralComponent(
    environmentId: string,
    centralComponentCreateRequest: CentralComponentCreateRequest,
  ): Observable<IdResponse> {
    return this.toObservable(() =>
      this.api().createCentralComponent({
        environmentId,
        centralComponentCreateRequest,
      }),
    );
  }

  deleteCentralComponent(centralComponentId: string): Observable<IdResponse> {
    return this.toObservable(() =>
      this.api().deleteCentralComponent({
        centralComponentId,
      }),
    );
  }

  checkFreeCaasUsage(
    environmentId: string,
  ): Observable<CaasAvailabilityResponse> {
    return this.toObservable(() =>
      this.api().checkFreeCaasUsage({environmentId}),
    );
  }

  private toObservable<T>(fn: () => Promise<T>): Observable<T> {
    return defer(() => from(fn()));
  }

  private api(): UiApi {
    return this.apiClientFactory.newAuthorityPortalClient().uiApi;
  }
}
