package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.thirdparty.keycloak.model.ApplicationRole
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class UserRoleMapper {
    val mapping = mapOf(
        Roles.UserRoles.OPERATOR_ADMIN to UserRoleDto.OPERATOR_ADMIN,
        Roles.UserRoles.SERVICE_PARTNER_ADMIN to UserRoleDto.SERVICE_PARTNER_ADMIN,
        Roles.UserRoles.AUTHORITY_ADMIN to UserRoleDto.AUTHORITY_ADMIN,
        Roles.UserRoles.AUTHORITY_USER to UserRoleDto.AUTHORITY_USER,
        Roles.UserRoles.PARTICIPANT_ADMIN to UserRoleDto.PARTICIPANT_ADMIN,
        Roles.UserRoles.PARTICIPANT_CURATOR to UserRoleDto.PARTICIPANT_CURATOR,
        Roles.UserRoles.PARTICIPANT_USER to UserRoleDto.PARTICIPANT_USER,
    )

    fun getUserRoles(roles: Set<String>): Set<UserRoleDto> {
        return roles.mapNotNull { mapping[it] }.toSet()
    }

    fun toOrganizationRole(role: UserRoleDto, userId: String, adminUserId: String): OrganizationRole {
        return when (role) {
            UserRoleDto.PARTICIPANT_ADMIN -> OrganizationRole.PARTICIPANT_ADMIN
            UserRoleDto.PARTICIPANT_CURATOR -> OrganizationRole.PARTICIPANT_CURATOR
            UserRoleDto.PARTICIPANT_USER -> OrganizationRole.PARTICIPANT_USER
            else -> {
                error("Participant Admin can only change role to Participant Admin, Curator or User. role=$role, userId=$userId, adminUserId=$adminUserId.")
            }
        }
    }

    fun toAuthorityRole(role: UserRoleDto, userId: String, adminUserId: String): ApplicationRole {
        return when (role) {
            UserRoleDto.AUTHORITY_ADMIN -> ApplicationRole.AUTHORITY_ADMIN
            UserRoleDto.AUTHORITY_USER -> ApplicationRole.AUTHORITY_USER
            else -> { error("Authority Admin can only change role to Authority Admin or Authority User. role=$role, userId=$userId, adminUserId=$adminUserId.") }
        }
    }
}
