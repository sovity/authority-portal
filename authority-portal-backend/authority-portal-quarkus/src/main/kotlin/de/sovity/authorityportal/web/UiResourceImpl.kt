package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.CreateOrganizationRequest
import de.sovity.authorityportal.api.model.ExamplePageQuery
import de.sovity.authorityportal.api.model.ExamplePageResult
import de.sovity.authorityportal.api.model.OrganizationDetailResult
import de.sovity.authorityportal.api.model.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.UserApprovalPageResult
import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.web.services.ExamplePageApiService
import de.sovity.authorityportal.web.services.ExampleTableApiService
import de.sovity.authorityportal.web.services.auth.AuthUtils
import de.sovity.authorityportal.web.services.auth.LoggedInUser
import de.sovity.authorityportal.web.services.pages.organizationmanagement.OrganizationManagementApiService
import de.sovity.authorityportal.web.services.pages.userapproval.UserApprovalPageApiService
import de.sovity.authorityportal.web.services.pages.userinfo.UserInfoApiService
import de.sovity.authorityportal.web.services.pages.userregistration.UserRegistrationApiService
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import jakarta.inject.Inject
import jakarta.transaction.Transactional

class UiResourceImpl : UiResource {
    @Inject
    lateinit var authUtils: AuthUtils

    @Inject
    lateinit var loggedInUser: LoggedInUser

    @Inject
    lateinit var examplePageApiService: ExamplePageApiService

    @Inject
    lateinit var exampleTableApiService: ExampleTableApiService

    @Inject
    lateinit var userInfoApiService: UserInfoApiService

    @Inject
    lateinit var userRegistrationApiService: UserRegistrationApiService

    @Inject
    lateinit var organizationManagementApiService: OrganizationManagementApiService

    @Inject
    lateinit var userApprovalPageApiService: UserApprovalPageApiService

    // Example
    @Transactional
    override fun examplePage(query: ExamplePageQuery): ExamplePageResult {
        return examplePageApiService.examplePage(query)
    }

    @Transactional
    override fun exampleDbQuery(): MutableList<String> {
        return exampleTableApiService.getExampleTableIds().toMutableList()
    }

    // User info
    @Transactional
    override fun userInfo(): UserInfo {
        authUtils.requiresAuthenticated()
        return userInfoApiService.userInfo(loggedInUser.userId)
    }

    // Registration
    @Transactional
    override fun userRegistrationStatus(): UserRegistrationStatusResult {
        authUtils.requiresAuthenticated()
        return userRegistrationApiService.userRegistrationStatus(loggedInUser.userId)
    }

    @Transactional
    override fun createOrganization(organization: CreateOrganizationRequest): String {
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
    override fun approveOrganization(mdsId: String): String {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return organizationManagementApiService.approveOrganization(mdsId)
    }

    @Transactional
    override fun rejectOrganization(mdsId: String): String {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return organizationManagementApiService.rejectOrganization(mdsId)
    }

    // LEGACY: user approval
    @Transactional
    override fun userApprovalPage(): UserApprovalPageResult {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return userApprovalPageApiService.userApprovalPage()
    }
}
