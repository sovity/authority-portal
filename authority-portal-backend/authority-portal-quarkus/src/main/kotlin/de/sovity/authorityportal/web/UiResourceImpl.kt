package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.CreateOrganizationRequest
import de.sovity.authorityportal.api.model.ExamplePageQuery
import de.sovity.authorityportal.api.model.ExamplePageResult
import de.sovity.authorityportal.api.model.UserApprovalPageResult
import de.sovity.authorityportal.api.model.UserInfoResult
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.web.services.ExamplePageApiService
import de.sovity.authorityportal.web.services.ExampleTableApiService
import de.sovity.authorityportal.web.services.auth.AuthUtils
import de.sovity.authorityportal.web.services.auth.LoggedInUser
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
    lateinit var userApprovalPageApiService: UserApprovalPageApiService

    @Inject
    lateinit var userRegistrationApiService: UserRegistrationApiService

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
    override fun userInfo(): UserInfoResult {
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

    // User Approval
    @Transactional
    override fun userApprovalPage(): UserApprovalPageResult {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return userApprovalPageApiService.userApprovalPage()
    }

    @Transactional
    override fun approveUser(userId: String): String {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return userApprovalPageApiService.approveUser(userId)
    }

    @Transactional
    override fun rejectUser(userId: String): String {
        authUtils.requiresRole(Roles.UserRoles.AUTHORITY_ADMIN)
        return userApprovalPageApiService.rejectUser(userId)
    }
}
