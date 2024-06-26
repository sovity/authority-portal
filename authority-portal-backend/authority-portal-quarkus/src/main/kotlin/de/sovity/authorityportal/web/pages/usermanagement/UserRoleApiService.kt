/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.utils.TimeUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.WebApplicationException
import jakarta.ws.rs.core.Response

@ApplicationScoped
class UserRoleApiService(
    val keycloakService: KeycloakService,
    val userRoleMapper: UserRoleMapper,
    val timeUtils: TimeUtils
){

    fun changeParticipantRole(userId: String, roleDto: UserRoleDto, mdsId: String, adminUserId: String): IdResponse {
        val role = userRoleMapper.toOrganizationRole(roleDto, userId, adminUserId)

        keycloakService.joinOrganization(userId, mdsId, role)
        keycloakService.forceLogout(userId)

        Log.info("Participant role changed. role=$role, userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(userId, timeUtils.now())
    }

    fun clearApplicationRole(userId: String, adminUserId: String): IdResponse {
        keycloakService.clearApplicationRole(userId)
        keycloakService.forceLogout(userId)

        Log.info("Application role cleared. userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(userId, timeUtils.now())
    }

    fun changeApplicationRole(userId: String, roleDto: UserRoleDto, adminUserId: String, userRoles: Set<String>): IdResponse {
        validateUserRole(userRoles, roleDto, adminUserId)
        val role = userRoleMapper.toApplicationRole(roleDto, userId, adminUserId)

        keycloakService.joinApplicationRole(userId, role)
        keycloakService.forceLogout(userId)

        Log.info("Application role changed. role=$role, userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(userId, timeUtils.now())
    }

    private fun validateUserRole(userRoles: Set<String>, roleDto: UserRoleDto, userId: String) {
        val userRolesDto = userRoleMapper.getUserRoles(userRoles)
        val isAuthorityAdmin = UserRoleDto.AUTHORITY_ADMIN in userRolesDto
        val hasRequestedRole = roleDto in userRolesDto
        if (!isAuthorityAdmin && !hasRequestedRole) {
            val errorMessage = "User with ID $userId does not have permission to change role to $roleDto"
            throw WebApplicationException(errorMessage, Response.Status.UNAUTHORIZED.statusCode)
        }
    }
}
