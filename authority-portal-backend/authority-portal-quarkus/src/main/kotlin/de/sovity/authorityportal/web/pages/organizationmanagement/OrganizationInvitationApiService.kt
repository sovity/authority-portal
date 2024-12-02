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

package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.InviteOrganizationRequest
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.web.model.CreateUserData
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import de.sovity.authorityportal.web.utils.TimeUtils
import de.sovity.authorityportal.web.utils.idmanagement.OrganizationIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class OrganizationInvitationApiService(
    val keycloakService: KeycloakService,
    val organizationService: OrganizationService,
    val userService: UserService,
    val organizationIdUtils: OrganizationIdUtils,
    val timeUtils: TimeUtils
) {

    fun inviteOrganization(invitationInformation: InviteOrganizationRequest, adminUserId: String): IdResponse {
        userService.assertUserDoesNotExistInDbOrThrow(invitationInformation.userEmail)

        val organizationId = organizationIdUtils.generateOrganizationId()
        val userId = keycloakService.createKeycloakUserAndOrganization(
            organizationId = organizationId,
            userEmail = invitationInformation.userEmail,
            userFirstName = invitationInformation.userFirstName,
            userLastName = invitationInformation.userLastName,
            userOrganizationRole = OrganizationRole.PARTICIPANT_ADMIN,
            userPassword = null
        )

        createDbUserAndOrganization(userId, organizationId, invitationInformation)
        keycloakService.sendInvitationEmailWithPasswordReset(userId)

        Log.info("Invited organization and corresponding initial Participant Admin. organizationId=$organizationId, userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(organizationId, timeUtils.now())
    }

    private fun createDbUserAndOrganization(
        userId: String,
        organizationId: String,
        invitationInformation: InviteOrganizationRequest
    ) {
        val user = userService.createUser(
            userId = userId,
            userData = buildUserData(invitationInformation),
            onboardingType = UserOnboardingType.INVITATION
        )
        organizationService.createInvitedOrganization(
            userId,
            organizationId,
            invitationInformation.orgName
        )
        user.organizationId = organizationId
        user.update()
    }

    private fun buildUserData(invitation: InviteOrganizationRequest): CreateUserData {
        return CreateUserData().apply {
            email = invitation.userEmail
            firstName = invitation.userFirstName
            lastName = invitation.userLastName
            jobTitle = invitation.userJobTitle
            phone = invitation.userPhoneNumber
        }
    }
}
