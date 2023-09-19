package de.sovity.authorityportal.web.services.pages.userinfo

import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.web.services.auth.LoggedInUser
import de.sovity.authorityportal.web.services.db.OrganizationService
import de.sovity.authorityportal.web.services.db.UserDetailService
import de.sovity.authorityportal.web.services.pages.userregistration.toDto
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserInfoApiService {

    @Inject
    lateinit var userDetailService: UserDetailService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userRoleMapper: UserRoleMapper

    fun userInfo(loggedInUser: LoggedInUser): UserInfo {
        val user = userDetailService.getUserData(loggedInUser.userId)
        val organizationMdsId = loggedInUser.organizationMdsId
        val organizationName = getOrganization(organizationMdsId)
        val roles = userRoleMapper.getUserRoles(loggedInUser.roles)

        return UserInfo(
            user.firstName,
            user.lastName,
            organizationName,
            organizationMdsId,
            roles.toList(),
            user.registrationStatus.toDto()
        )
    }

    private fun getOrganization(mdsId: String?): String? {
        if (mdsId.isNullOrEmpty()) {
            return null
        }
        val organization = organizationService.getOrganizationOrThrow(mdsId)

        return organization.name
    }
}
