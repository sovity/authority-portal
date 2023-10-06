package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserRoleApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var userRoleMapper: UserRoleMapper

    fun changeParticipantRole(userId: String, roleDto: UserRoleDto, mdsId: String, adminUserId: String): IdResponse {
        val role = userRoleMapper.toOrganizationRole(roleDto, userId, adminUserId)

        keycloakService.joinOrganization(userId, mdsId, role)
        keycloakService.forceLogout(userId)

        Log.info("Participant role changed. role=$role, userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(userId)
    }

    fun changeAuthorityRole(userId: String, roleDto: UserRoleDto, adminUserId: String): IdResponse {
        val role = userRoleMapper.toAuthorityRole(roleDto, userId, adminUserId)

        keycloakService.joinApplicationRole(userId, role)
        keycloakService.forceLogout(userId)

        Log.info("Authority role changed. role=$role, userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(userId)
    }
}
