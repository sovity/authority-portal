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
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserInvitationApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var userRoleMapper: UserRoleMapper

    fun inviteParticipantUser(
        userInformation: InviteParticipantUserRequest,
        mdsId: String,
        adminUserId: String
    ): IdResponse {
        val userId = keycloakService.createUser(userInformation.email, userInformation.firstName, userInformation.lastName)
        keycloakService.sendInvitationEmailWithPasswordReset(userId)
        keycloakService.joinOrganization(userId, mdsId, userRoleMapper.toOrganizationRole(userInformation.role, userId, adminUserId))

        userService.createUser(
            userId = userId,
            mdsId = mdsId,
            onboardingType = UserOnboardingType.INVITATION,
            invitedBy = adminUserId
        ).also {
            it.firstName = userInformation.firstName
            it.lastName = userInformation.lastName
            it.email = userInformation.email
            it.update()
        }

        Log.info("New participant account invited. userId=$userId, role=${userInformation.role}, mdsId=$mdsId, adminUserId=$adminUserId")

        return IdResponse(userId)
    }
}
