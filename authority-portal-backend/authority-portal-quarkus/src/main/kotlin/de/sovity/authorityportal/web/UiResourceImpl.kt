package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.ConnectorDetailDto
import de.sovity.authorityportal.api.model.ConnectorOverviewResult
import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.api.model.CreateOrganizationRequest
import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.OrganizationDetailResult
import de.sovity.authorityportal.api.model.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.auth.AuthUtils
import de.sovity.authorityportal.web.services.auth.LoggedInUser
import de.sovity.authorityportal.web.services.pages.connectormanagement.ConnectorManagementApiService
import de.sovity.authorityportal.web.services.pages.organizationmanagement.OrganizationManagementApiService
import de.sovity.authorityportal.web.services.pages.userinfo.UserInfoApiService
import de.sovity.authorityportal.web.services.pages.userregistration.UserRegistrationApiService
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
    lateinit var userRegistrationApiService: UserRegistrationApiService

    @Inject
    lateinit var organizationManagementApiService: OrganizationManagementApiService

    @Inject
    lateinit var connectorManagementApiService: ConnectorManagementApiService

    // User info
    @Transactional
    override fun userInfo(): UserInfo {
        authUtils.requiresAuthenticated()
        return userInfoApiService.userInfo(loggedInUser)
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
        authUtils.requiresRegistrationStatus(UserRegistrationStatus.CREATED)
        return userRegistrationApiService.createOrganization(loggedInUser.userId, organization)
    }

    // Organization management
    @Transactional
    override fun organizationsOverview(): OrganizationOverviewResult {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return organizationManagementApiService.organizationsOverview()
    }

    @Transactional
    override fun organizationDetails(mdsId: String): OrganizationDetailResult {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return organizationManagementApiService.organizationDetails(mdsId)
    }

    @Transactional
    override fun approveOrganization(mdsId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return organizationManagementApiService.approveOrganization(mdsId)
    }

    @Transactional
    override fun rejectOrganization(mdsId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return organizationManagementApiService.rejectOrganization(mdsId)
    }

    // Connector management
    @Transactional
    override fun ownOrganizationConnectors(): ConnectorOverviewResult {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_USER)
        authUtils.requiresMemberOfOrganization()
        return connectorManagementApiService.listOwnOrganizationConnectors(loggedInUser.organizationMdsId!!)
    }

    @Transactional
    override fun ownOrganizationConnectorDetails(connectorId: String): ConnectorDetailDto {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_USER)
        authUtils.requiresMemberOfOrganization()
        return connectorManagementApiService.ownOrganizationConnectorDetails(loggedInUser.organizationMdsId!!, connectorId)
    }

    @Transactional
    override fun organizationConnectors(mdsId: String): ConnectorOverviewResult {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.OPERATOR_ADMIN)
        return connectorManagementApiService.listOrganizationConnectors(mdsId)
    }

    @Transactional
    override fun connectorDetails(mdsId: String, connectorId: String): ConnectorDetailDto {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.OPERATOR_ADMIN)
        return connectorManagementApiService.getConnectorDetails(connectorId, mdsId)
    }

    @Transactional
    override fun createOwnConnector(connector: CreateConnectorRequest): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_CURATOR)
        authUtils.requiresMemberOfOrganization()
        return connectorManagementApiService.createOwnConnector(loggedInUser.userId, loggedInUser.organizationMdsId!!, connector)
    }

    @Transactional
    override fun deleteOwnConnector(connectorId: String): IdResponse {
        authUtils.requiresRole(Roles.UserRoles.PARTICIPANT_CURATOR)
        TODO("Not yet implemented")
    }

    @Transactional
    override fun createProvidedConnector(mdsId: String, connector: CreateConnectorRequest): IdResponse {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.SERVICEPARTNER_ADMIN)
        authUtils.requiresMemberOfOrganization()
        return connectorManagementApiService.createProvidedConnector(loggedInUser.userId, loggedInUser.organizationMdsId!!, mdsId, connector)
    }

    @Transactional
    override fun deleteProvidedConnector(mdsId: String, connectorId: String): IdResponse {
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.SERVICEPARTNER_ADMIN)
        TODO("Not yet implemented")
    }
}
