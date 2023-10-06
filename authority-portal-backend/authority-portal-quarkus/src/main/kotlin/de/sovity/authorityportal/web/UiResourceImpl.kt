package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.ConnectorDetailDto
import de.sovity.authorityportal.api.model.ConnectorOverviewResult
import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.api.model.CreateOrganizationRequest
import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.InviteParticipantUserRequest
import de.sovity.authorityportal.api.model.OrganizationDetailResult
import de.sovity.authorityportal.api.model.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.auth.AuthUtils
import de.sovity.authorityportal.web.auth.LoggedInUser
import de.sovity.authorityportal.web.pages.connectormanagement.ConnectorManagementApiService
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationManagementApiService
import de.sovity.authorityportal.web.pages.usermanagement.UserInfoApiService
import de.sovity.authorityportal.web.pages.usermanagement.UserRoleApiService
import de.sovity.authorityportal.web.pages.userregistration.UserDeactivationApiService
import de.sovity.authorityportal.web.pages.userregistration.UserInvitationApiService
import de.sovity.authorityportal.web.pages.userregistration.UserRegistrationApiService
import jakarta.inject.Inject
import jakarta.transaction.Transactional

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
    lateinit var organizationManagementApiService: OrganizationManagementApiService

    @Inject
    lateinit var connectorManagementApiService: ConnectorManagementApiService

    // User info
    @Transactional
    override fun userInfo(): UserInfo {
        authUtils.requiresAuthenticated()
        return userInfoApiService.userInfo(loggedInUser.userId, loggedInUser.organizationMdsId, loggedInUser.roles)
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
    override fun changeAuthorityRole(userId: String, roleDto: UserRoleDto): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        authUtils.requiresMemberOfSameOrganizationAs(userId)
        return userRoleApiService.changeAuthorityRole(userId, roleDto, loggedInUser.userId)
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
    override fun organizationsOverview(): OrganizationOverviewResult {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_USER)
        return organizationManagementApiService.organizationsOverview(loggedInUser.userId)
    }

    @Transactional
    override fun organizationDetails(mdsId: String): OrganizationDetailResult {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_USER)
        return organizationManagementApiService.organizationDetails(mdsId, loggedInUser.userId)
    }

    @Transactional
    override fun approveOrganization(mdsId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_USER)
        return organizationManagementApiService.approveOrganization(mdsId, loggedInUser.userId)
    }

    @Transactional
    override fun rejectOrganization(mdsId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_USER)
        return organizationManagementApiService.rejectOrganization(mdsId, loggedInUser.userId)
    }

    // Connector management
    @Transactional
    override fun ownOrganizationConnectors(): ConnectorOverviewResult {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_USER)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.listOwnOrganizationConnectors(loggedInUser.organizationMdsId!!, loggedInUser.userId)
    }

    @Transactional
    override fun ownOrganizationConnectorDetails(connectorId: String): ConnectorDetailDto {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_USER)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.ownOrganizationConnectorDetails(connectorId, loggedInUser.organizationMdsId!!, loggedInUser.userId)
    }

    @Transactional
    override fun organizationConnectors(mdsId: String): ConnectorOverviewResult {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.OPERATOR_ADMIN)
        return connectorManagementApiService.listOrganizationConnectors(mdsId, loggedInUser.userId)
    }

    @Transactional
    override fun connectorDetails(mdsId: String, connectorId: String): ConnectorDetailDto {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.OPERATOR_ADMIN)
        return connectorManagementApiService.getConnectorDetails(connectorId, mdsId, loggedInUser.userId)
    }

    @Transactional
    override fun createOwnConnector(connector: CreateConnectorRequest): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_CURATOR)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.createOwnConnector(connector, loggedInUser.organizationMdsId!!, loggedInUser.userId)
    }

    @Transactional
    override fun deleteOwnConnector(connectorId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_CURATOR)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.deleteOwnConnector(connectorId, loggedInUser.organizationMdsId!!, loggedInUser.userId)
    }

    @Transactional
    override fun createProvidedConnector(mdsId: String, connector: CreateConnectorRequest): IdResponse {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.SERVICE_PARTNER_ADMIN)
        authUtils.requiresMemberOfAnyOrganization()
        return connectorManagementApiService.createProvidedConnector(connector, mdsId, loggedInUser.organizationMdsId!!, loggedInUser.userId)
    }

    @Transactional
    override fun deleteProvidedConnector(mdsId: String, connectorId: String): IdResponse {
        TODO("Not yet implemented")
    }
}
