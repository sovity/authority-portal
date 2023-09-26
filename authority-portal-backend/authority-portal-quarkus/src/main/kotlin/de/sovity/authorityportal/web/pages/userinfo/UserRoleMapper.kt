package de.sovity.authorityportal.web.pages.userinfo

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.Roles
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class UserRoleMapper {
    val mapping = mapOf(
        Roles.UserRoles.OPERATOR_ADMIN to UserRoleDto.OPERATOR_ADMIN,
        Roles.UserRoles.SERVICE_PARTNER_ADMIN to UserRoleDto.SERVICEPARTNER_ADMIN,
        Roles.UserRoles.AUTHORITY_ADMIN to UserRoleDto.AUTHORITY_ADMIN,
        Roles.UserRoles.AUTHORITY_USER to UserRoleDto.AUTHORITY_USER,
        Roles.UserRoles.PARTICIPANT_ADMIN to UserRoleDto.PARTICIPANT_ADMIN,
        Roles.UserRoles.PARTICIPANT_CURATOR to UserRoleDto.PARTICIPANT_CURATOR,
        Roles.UserRoles.PARTICIPANT_USER to UserRoleDto.PARTICIPANT_USER,
    )

    fun getUserRoles(roles: Set<String>): Set<UserRoleDto> {
        return roles.mapNotNull { mapping[it] }.toSet()
    }
}
