package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.MemberInfo
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
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
        val dbUser = userService.getUserOrThrow(userId)
        return buildUserDetail(dbUser)
    }

    fun getAllUserDetails(): List<UserDetail> {
        val dbUsers = userService.getAllUsers()
        return dbUsers.map { dbUser -> buildUserDetail(dbUser) }
    }

    private fun buildUserDetail(dbUser: UserRecord) = UserDetail(
        userId = dbUser.id,
        firstName = dbUser.firstName ?: "",
        lastName = dbUser.lastName ?: "",
        email = dbUser.email ?: "",
        position = dbUser.jobTitle ?: "",
        phoneNumber = dbUser.phone ?: "",
        organizationMdsId = dbUser.organizationMdsId,
        registrationStatus = dbUser.registrationStatus,
        createdAt = dbUser.createdAt,
        roles = keycloakService.getUserRoles(dbUser.id),
        onboardingType = dbUser.onboardingType,
        invitedBy = dbUser.invitedBy
    )

    fun getOrganizationMembers(mdsId: String): List<MemberInfo> {
        val members = keycloakService.getOrganizationMembers(mdsId)
        return members.map {
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

    private fun getHighestUserRoles(user: KeycloakUserDto): List<UserRoleDto> {
        // TODO: n + 1 calls to Keycloak => improve
        val keycloakRoles = keycloakService.getUserRoles(user.userId)
        val roles = userRoleMapper.getUserRoles(keycloakRoles)
        return userRoleMapper.getHighestRoles(roles)
    }
}
