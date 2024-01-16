package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.MemberInfo
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.pages.usermanagement.UserRoleMapper
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
            kcUser.userId,
            kcUser.firstName,
            kcUser.lastName,
            kcUser.email,
            kcUser.position,
            kcUser.phoneNumber,
            dbUser.organizationMdsId,
            dbUser.registrationStatus,
            dbUser.createdAt,
            roles
        )
    }

    fun getUserDetailsByOrganization(mdsId: String): List<UserDetail> {
        val dbUsers = userService.getUsersByMdsId(mdsId)
        return dbUsers.let { user ->
            user.map {
                val kcUser = keycloakService.getUser(it.id)
                UserDetail(
                    it.id,
                    kcUser.firstName,
                    kcUser.lastName,
                    kcUser.email,
                    kcUser.position,
                    kcUser.phoneNumber,
                    mdsId,
                    it.registrationStatus,
                    it.createdAt,
                    keycloakService.getUserRoles(it.id)
                )
            }
        }
    }

    fun getOrganizationMembers(mdsId: String): List<MemberInfo> {
        val members = keycloakService.getOrganizationMembers(mdsId)
        return members.let { user ->
            user.map {
                MemberInfo(
                    it.userId,
                    it.firstName,
                    it.lastName,
                    getHighestUserRoles(it)
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
