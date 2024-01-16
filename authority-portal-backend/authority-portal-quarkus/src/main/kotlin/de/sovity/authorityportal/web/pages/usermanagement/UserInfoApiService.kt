package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.UserDetailDto
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

    /**
     * Retrieves user details for the specified user ID.
     *
     * @param userId The ID of the user for whom to retrieve details.
     * @return [UserDetailDto] object containing the user's details.
     * @see userDetailService.getUserData
     * @see userRoleMapper.getUserRoles
     * @see UserDetailDto
     */
    fun userDetails(userId: String): UserDetailDto {
        val user = userDetailService.getUserData(userId)
        val roleDtos = userRoleMapper.getUserRoles(user.roles)

        return UserDetailDto(
            user.firstName,
            user.lastName,
            user.email,
            roleDtos.toList(),
            user.registrationStatus.toDto(),
            user.createdAt
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
