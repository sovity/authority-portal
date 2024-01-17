package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.MemberInfo
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.pages.usermanagement.UserRoleMapper
import de.sovity.authorityportal.web.pages.userregistration.toDto
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserDetailService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var userRoleMapper: UserRoleMapper

    fun getUserData(userId: String): UserDetail {
        val kcUser = keycloakService.getUser(userId)
        val dbUser = userService.getUserOrThrow(userId)
        val roles = keycloakService.getUserRoles(userId)

        return UserDetail(
            userId = kcUser.userId,
            firstName = kcUser.firstName,
            lastName = kcUser.lastName,
            email = kcUser.email,
            position = kcUser.position,
            phoneNumber = kcUser.phoneNumber,
            organizationMdsId = dbUser.organizationMdsId,
            registrationStatus = dbUser.registrationStatus,
            createdAt = dbUser.createdAt,
            roles = roles,
            onboardingType = dbUser.onboardingType,
            invitedBy = dbUser.invitedBy
        )
    }

    fun getUserDetailsByOrganization(mdsId: String): List<UserDetail> {
        val dbUsers = userService.getUsersByMdsId(mdsId)
        return dbUsers.let { user ->
            user.map {
                val kcUser = keycloakService.getUser(it.id)
                UserDetail(
                    userId = it.id,
                    firstName = kcUser.firstName,
                    lastName = kcUser.lastName,
                    email = kcUser.email,
                    position = kcUser.position,
                    phoneNumber = kcUser.phoneNumber,
                    organizationMdsId = mdsId,
                    registrationStatus = it.registrationStatus,
                    createdAt = it.createdAt,
                    roles = keycloakService.getUserRoles(it.id),
                    onboardingType = it.onboardingType,
                    invitedBy = it.invitedBy
                )
            }
        }
    }

    fun getOrganizationMembers(mdsId: String): List<MemberInfo> {
        val members = keycloakService.getOrganizationMembers(mdsId)
        return members.let { user ->
            user.map {
                val dbUser = userService.getUserOrThrow(it.userId)
                MemberInfo(
                    it.userId,
                    it.firstName,
                    it.lastName,
                    getHighestUserRoles(it),
                    dbUser.registrationStatus.toDto(),
                )
            }
        }
    }

    private fun getHighestUserRoles(user: KeycloakUserDto): List<UserRoleDto> {
        // TODO: n + 1 calls to Keycloak => improve
        val keycloakRoles = keycloakService.getUserRoles(user.userId)
        val roles = userRoleMapper.getUserRoles(keycloakRoles)
        return userRoleMapper.getHighestRoles(roles)
    }
}
