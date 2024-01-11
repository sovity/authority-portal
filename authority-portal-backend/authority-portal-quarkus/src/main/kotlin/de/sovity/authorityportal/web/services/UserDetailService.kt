package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.MemberInfo
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.pages.usermanagement.UserRoleMapper
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
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

    fun getUserDetails(userId: String): UserDetail {
        val dbUser = userService.getUserOrThrow(userId)
        val roles = keycloakService.getUserRoles(userId)

        return UserDetail(
            dbUser.id,
            dbUser.firstName,
            dbUser.lastName,
            dbUser.email,
            dbUser.jobTitle,
            dbUser.phone,
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
                UserDetail(
                    it.id,
                    it.firstName,
                    it.lastName,
                    it.email,
                    it.jobTitle,
                    it.phone,
                    it.organizationMdsId,
                    it.registrationStatus,
                    it.createdAt,
                    keycloakService.getUserRoles(it.id)
                )
            }
        }
    }

    fun getOrganizationMembers(mdsId: String): List<MemberInfo> {
        val members = userService.getUsersByMdsId(mdsId)
        return members.let { user ->
            user.map {
                MemberInfo(
                    it.id,
                    it.email,
                    it.firstName,
                    it.lastName,
                    getHighestUserRoles(it.id)
                )
            }
        }
    }

    private fun getHighestUserRoles(userId: String): List<UserRoleDto> {
        // TODO: n + 1 calls to Keycloak => improve
        val keycloakRoles = keycloakService.getUserRoles(userId)
        val roles = userRoleMapper.getUserRoles(keycloakRoles)
        return userRoleMapper.getHighestRoles(roles)
    }
}
