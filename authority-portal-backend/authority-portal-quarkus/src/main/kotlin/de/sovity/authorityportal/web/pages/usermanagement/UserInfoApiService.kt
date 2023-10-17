package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.web.pages.userregistration.toDto
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetailService
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

    fun userInfo(userId: String, mdsId: String?, roles: Set<String>): UserInfo {
        val user = userDetailService.getUserData(userId)
        val organizationName = getOrganization(mdsId)
        val roleDtos = userRoleMapper.getUserRoles(roles)

        return UserInfo(
            userId,
            user.firstName,
            user.lastName,
            organizationName,
            mdsId,
            roleDtos.toList(),
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
