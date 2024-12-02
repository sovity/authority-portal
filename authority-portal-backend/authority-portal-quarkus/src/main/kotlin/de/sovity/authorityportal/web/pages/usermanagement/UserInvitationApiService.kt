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
import de.sovity.authorityportal.api.model.InviteParticipantUserRequest
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.utils.TimeUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class UserInvitationApiService(
    val keycloakService: KeycloakService,
    val userService: UserService,
    val userRoleMapper: UserRoleMapper,
    val timeUtils: TimeUtils
) {

    fun inviteParticipantUser(
        userInformation: InviteParticipantUserRequest,
        organizationId: String,
        adminUserId: String
    ): IdResponse {
        userService.assertUserDoesNotExistInDbOrThrow(userInformation.email)

        // DB is source of truth, so we delete an existing user in Keycloak
        val maybeExistingUserId = keycloakService.getUserIdByEmail(userInformation.email)
        if (maybeExistingUserId != null) {
            keycloakService.deleteUser(maybeExistingUserId)
        }

        val userId =
            keycloakService.createUser(userInformation.email, userInformation.firstName, userInformation.lastName)
        keycloakService.sendInvitationEmailWithPasswordReset(userId)
        keycloakService.joinOrganization(
            userId = userId,
            organizationId = organizationId,
            role = userRoleMapper.toOrganizationRole(userInformation.role, userId, adminUserId)
        )

        userService.createUser(
            userId = userId,
            organizationId = organizationId,
            onboardingType = UserOnboardingType.INVITATION,
            invitedBy = adminUserId
        ).also {
            it.firstName = userInformation.firstName
            it.lastName = userInformation.lastName
            it.email = userInformation.email
            it.update()
        }

        Log.info("New participant account invited. userId=$userId, role=${userInformation.role}, organizationId=$organizationId, adminUserId=$adminUserId")

        return IdResponse(userId, timeUtils.now())
    }
}
