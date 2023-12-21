package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.ConnectorDetailDto
import de.sovity.authorityportal.api.model.ConnectorOverviewResult
import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.api.model.CreateConnectorResponse
import de.sovity.authorityportal.api.model.DeploymentEnvironmentDto
import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.InviteOrganizationRequest
import de.sovity.authorityportal.api.model.InviteParticipantUserRequest
import de.sovity.authorityportal.api.model.RegistrationRequestDto
import de.sovity.authorityportal.api.model.UpdateOrganizationDto
import de.sovity.authorityportal.api.model.UpdateUserDto
import de.sovity.authorityportal.api.model.UserDetailDto
import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.api.model.organization.CreateOrganizationRequest
import de.sovity.authorityportal.api.model.organization.OrganizationDetailsDto
import de.sovity.authorityportal.api.model.organization.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.organization.OwnOrganizationDetailsDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.auth.AuthUtils
import de.sovity.authorityportal.web.auth.LoggedInUser
import de.sovity.authorityportal.web.pages.connectormanagement.ConnectorManagementApiService
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationInfoApiService
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationInvitationApiService
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationRegistrationApiService
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationUpdateApiService
import de.sovity.authorityportal.web.pages.redirects.BrokerRedirectApiService
import de.sovity.authorityportal.web.pages.registration.RegistrationApiService
import de.sovity.authorityportal.web.pages.usermanagement.UserDeactivationApiService
import de.sovity.authorityportal.web.pages.usermanagement.UserInfoApiService
import de.sovity.authorityportal.web.pages.usermanagement.UserInvitationApiService
import de.sovity.authorityportal.web.pages.usermanagement.UserRoleApiService
import de.sovity.authorityportal.web.pages.usermanagement.UserUpdateApiService
import de.sovity.authorityportal.web.pages.userregistration.UserRegistrationApiService
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import jakarta.ws.rs.core.Response

class UiResourceImpl : UiResource {
    @Inject
    lateinit var authUtils: AuthUtils

    @Inject
    lateinit var loggedInUser: LoggedInUser

    @Inject
    lateinit var userInfoApiService: UserInfoApiService

    @Inject
    lateinit var userRoleApiService: UserRoleApiService

    @Inject
    lateinit var userRegistrationApiService: UserRegistrationApiService

    @Inject
    lateinit var userInvitationApiService: UserInvitationApiService

    @Inject
    lateinit var userDeactivationApiService: UserDeactivationApiService

    @Inject
    lateinit var organizationInfoApiService: OrganizationInfoApiService

    @Inject
    lateinit var organizationRegistrationApiService: OrganizationRegistrationApiService

    @Inject
    lateinit var organizationInvitationApiService: OrganizationInvitationApiService

    @Inject
    lateinit var connectorManagementApiService: ConnectorManagementApiService

    @Inject
    lateinit var brokerRedirectApiService: BrokerRedirectApiService

    @Inject
    lateinit var registrationApiService: RegistrationApiService

    @Inject
    lateinit var userUpdateApiService: UserUpdateApiService

    @Inject
    lateinit var organizationUpdateApiService: OrganizationUpdateApiService

    // User info
    @Transactional
    override fun userInfo(): UserInfo {
        authUtils.requiresAuthenticated()
        return userInfoApiService.userInfo(loggedInUser.userId, loggedInUser.organizationMdsId, loggedInUser.roles)
    }

    /**
     * Retrieves user details for the specified user ID.
     *
     * @param userId The ID of the user for whom to retrieve details.
     * @return [UserDetailDto] object containing the user's details.
     */
    @Transactional
    override fun userDetails(userId: String): UserDetailDto {
        authUtils.requires(authUtils.hasRole(Roles.UserRoles.AUTHORITY_USER) ||
            (authUtils.hasRole(Roles.UserRoles.PARTICIPANT_USER) && authUtils.isMemberOfSameOrganizationAs(userId)), userId);
        return userInfoApiService.userDetails(userId);
    }

    // Registration
    @Transactional
    override fun userRegistrationStatus(): UserRegistrationStatusResult {
        authUtils.requiresAuthenticated()
        return userRegistrationApiService.userRegistrationStatus(loggedInUser.userId)
    }

    @Transactional
    override fun createOrganization(organization: CreateOrganizationRequest): IdResponse {
        authUtils.requiresAuthenticated()
        authUtils.requiresAnyRegistrationStatus(UserRegistrationStatus.CREATED, UserRegistrationStatus.FIRST_USER)
        return userRegistrationApiService.createOrganization(organization, loggedInUser.userId)
    }

    // Organization management (Internal)
    @Transactional
    override fun changeParticipantRole(userId: String, roleDto: UserRoleDto): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_ADMIN)
        authUtils.requiresMemberOfSameOrganizationAs(userId)
        return userRoleApiService.changeParticipantRole(userId, roleDto, loggedInUser.organizationMdsId!!, loggedInUser.userId)
    }

    @Transactional
    override fun inviteUser(invitationInformation: InviteParticipantUserRequest): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_ADMIN)
        authUtils.requiresMemberOfAnyOrganization()
        return userInvitationApiService.inviteParticipantUser(invitationInformation, loggedInUser.organizationMdsId!!, loggedInUser.userId)
    }

    @Transactional
    override fun deactivateParticipantUser(userId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_ADMIN)
        authUtils.requiresTargetNotSelf(userId)
        authUtils.requiresMemberOfSameOrganizationAs(userId)
        return userDeactivationApiService.deactivateUser(userId, loggedInUser.userId)
    }

    @Transactional
    override fun reactivateParticipantUser(userId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_ADMIN)
        authUtils.requiresMemberOfSameOrganizationAs(userId)
        return userDeactivationApiService.reactivateUser(userId, loggedInUser.userId)
    }

    // Organization management (Authority)
    @Transactional
    override fun changeApplicationRole(userId: String, roleDto: UserRoleDto): IdResponse {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.OPERATOR_ADMIN,
            Roles.UserRoles.SERVICE_PARTNER_ADMIN)
        if (!authUtils.hasRole(Roles.UserRoles.AUTHORITY_ADMIN)) {
            authUtils.requiresMemberOfSameOrganizationAs(userId)
        }
        return userRoleApiService.changeAuthorityRole(userId, roleDto, loggedInUser.userId, loggedInUser.roles)
    }

    @Transactional
    override fun deactivateAnyUser(userId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        authUtils.requiresTargetNotSelf(userId)
        return userDeactivationApiService.deactivateUser(userId, loggedInUser.userId)
    }

    @Transactional
    override fun reactivateAnyUser(userId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return userDeactivationApiService.reactivateUser(userId, loggedInUser.userId)
    }

    @Transactional
    override fun organizationsOverview(environmentId: String): OrganizationOverviewResult {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_USER)
        return organizationInfoApiService.organizationsOverview(environmentId)
    }

    @Transactional
    override fun ownOrganizationDetails(): OwnOrganizationDetailsDto {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_USER)
        authUtils.requiresMemberOfAnyOrganization()
        return organizationInfoApiService.getOwnOrganizationInformation(loggedInUser.organizationMdsId!!);
    }

    @Transactional
    override fun organizationDetails(mdsId: String, environmentId: String): OrganizationDetailsDto {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_USER)
        return organizationInfoApiService.getOrganizationInformation(mdsId, environmentId);
    }

    @Transactional
    override fun inviteOrganization(invitationInformation: InviteOrganizationRequest): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_USER)
        return organizationInvitationApiService.inviteOrganization(invitationInformation, loggedInUser.userId)
    }

    @Transactional
    override fun approveOrganization(mdsId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_USER)
        return organizationRegistrationApiService.approveOrganization(mdsId, loggedInUser.userId)
    }

    @Transactional
    override fun rejectOrganization(mdsId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_USER)
        return organizationRegistrationApiService.rejectOrganization(mdsId, loggedInUser.userId)
    }

    // Connector management
    @Transactional
    override fun ownOrganizationConnectors(environmentId: String): ConnectorOverviewResult {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_USER)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.listOrganizationConnectors(loggedInUser.organizationMdsId!!, environmentId)
    }

    @Transactional
    override fun ownOrganizationConnectorDetails(connectorId: String): ConnectorDetailDto {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_USER)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.ownOrganizationConnectorDetails(connectorId, loggedInUser.organizationMdsId!!, loggedInUser.userId)
    }

    override fun redirectToOwnOrganizationCatalog(environmentId: String): Response {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_USER)
        authUtils.requiresMemberOfAnyOrganization()
        return brokerRedirectApiService.buildCatalogRedirectWithConnectorFilter(loggedInUser.organizationMdsId!!, environmentId)
    }

    @Transactional
    override fun organizationConnectors(mdsId: String, environmentId: String): ConnectorOverviewResult {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.OPERATOR_ADMIN)
        return connectorManagementApiService.listOrganizationConnectors(mdsId, environmentId)
    }

    @Transactional
    override fun connectorDetails(mdsId: String, connectorId: String): ConnectorDetailDto {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.OPERATOR_ADMIN)
        return connectorManagementApiService.getConnectorDetails(connectorId, mdsId, loggedInUser.userId)
    }

    @Transactional
    override fun createOwnConnector(environmentId: String, connector: CreateConnectorRequest): CreateConnectorResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_CURATOR)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.createOwnConnector(connector, loggedInUser.organizationMdsId!!, loggedInUser.userId, environmentId)
    }

    @Transactional
    override fun deleteOwnConnector(connectorId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_CURATOR)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.deleteOwnConnector(connectorId, loggedInUser.organizationMdsId!!, loggedInUser.userId)
    }

    @Transactional
    override fun createProvidedConnector(mdsId: String, environmentId: String, connector: CreateConnectorRequest): CreateConnectorResponse {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.SERVICE_PARTNER_ADMIN)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.createProvidedConnector(connector, mdsId, loggedInUser.organizationMdsId!!, loggedInUser.userId, environmentId)
    }

    @Transactional
    override fun deleteProvidedConnector(mdsId: String, connectorId: String): IdResponse {
        TODO("Not yet implemented")
    }

    @Transactional
    override fun deploymentEnvironmentList(): List<DeploymentEnvironmentDto> {
        return connectorManagementApiService.getAllDeploymentEnvironment();
    }

    @Transactional
    override fun registerUser(registrationRequest: RegistrationRequestDto): IdResponse {
        return registrationApiService.registerUserAndOrganization(registrationRequest);
    }

    @Transactional
    override fun updateUser(userId: String, updateUserDto: UpdateUserDto): IdResponse {
        authUtils.requiresSelfOrRole(userId, Roles.UserRoles.AUTHORITY_ADMIN)
        return userUpdateApiService.updateUserDetails(userId, updateUserDto)
    }

    @Transactional
    override fun updateOwnOrganizationDeatils(organizationDto: UpdateOrganizationDto): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_ADMIN)
        authUtils.requiresMemberOfAnyOrganization()
        return organizationUpdateApiService.updateOrganizationDetails(loggedInUser.organizationMdsId!!, organizationDto)
    }

    @Transactional
    override fun updateOrganizationDetails(mdsId: String, organizationDto: UpdateOrganizationDto): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return organizationUpdateApiService.updateOrganizationDetails(mdsId, organizationDto)
    }
}
