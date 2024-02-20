package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.UserAuthenticationStatusDto
import de.sovity.authorityportal.api.model.UserDetailDto
import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.auth.LoggedInUser
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

    fun userInfo(loggedInUser: LoggedInUser): UserInfo = when {
        loggedInUser.authenticated -> authenticatedUserInfo(loggedInUser)
        else -> unauthenticatedUserInfo()
    }

    private fun authenticatedUserInfo(loggedInUser: LoggedInUser): UserInfo {
        val mdsId = loggedInUser.organizationMdsId
        val userId = loggedInUser.userId

        val user = userDetailService.getUserData(userId)
        val organizationName = getOrganization(mdsId)
        val roles = userRoleMapper.getUserRoles(loggedInUser.roles)

        return UserInfo().also {
            it.authenticationStatus = UserAuthenticationStatusDto.AUTHENTICATED
            it.userId = userId
            it.firstName = user.firstName
            it.lastName = user.lastName
            it.roles = roles.toList()
            it.registrationStatus = user.registrationStatus.toDto()
            it.organizationMdsId = mdsId
            it.organizationName = organizationName
        }
    }

    private fun unauthenticatedUserInfo(): UserInfo {
        return UserInfo().also {
            it.authenticationStatus = UserAuthenticationStatusDto.UNAUTHENTICATED
            it.userId = "unauthenticated"
            it.firstName = "Unknown"
            it.lastName = "User"
            it.roles = listOf(UserRoleDto.UNAUTHENTICATED)
            it.registrationStatus = null
            it.organizationMdsId = "unauthenticated"
            it.organizationName = "No Organization"
        }
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
        val invitingUser = user.invitedBy?.let { userDetailService.getUserData(it) }
        val roleDtos = userRoleMapper.getUserRoles(user.roles)

        return UserDetailDto(
            user.firstName,
            user.lastName,
            user.email,
            roleDtos.toList(),
            user.registrationStatus.toDto(),
            user.createdAt,
            getOrganization(user.organizationMdsId),
            user.phoneNumber,
            user.position,
            user.onboardingType.toDto(),
            invitingUser?.userId,
            invitingUser?.firstName,
            invitingUser?.lastName
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
