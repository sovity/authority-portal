package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.MemberInfo
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

    fun getOrganizationMembers(mdsId: String): List<MemberInfo> {
        val members = keycloakService.getOrganizationMembers(mdsId)
        return members.let { user ->
            user.map {
                MemberInfo(
                    it.userId,
                    it.firstName,
                    it.lastName,
                    userRoleMapper.getUserRoles(
                        keycloakService.getUserRoles(it.userId)
                    ).toList()
                )
            }
        }
    }
}
