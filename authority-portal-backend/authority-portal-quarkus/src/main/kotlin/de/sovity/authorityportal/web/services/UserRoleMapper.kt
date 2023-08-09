package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.enums.UserRole

fun UserRole.toDto(): UserRoleDto = when (this) {
    UserRole.USER -> UserRoleDto.USER
    UserRole.ADMIN -> UserRoleDto.ADMIN
}

fun UserRoleDto.toDb(): UserRole = when (this) {
    UserRoleDto.USER -> UserRole.USER
    UserRoleDto.ADMIN -> UserRole.ADMIN
}
