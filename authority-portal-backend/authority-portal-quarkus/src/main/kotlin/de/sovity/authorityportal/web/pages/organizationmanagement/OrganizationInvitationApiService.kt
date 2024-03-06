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
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.model.CreateUserData
import de.sovity.authorityportal.web.services.OrganizationMetadataService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import de.sovity.authorityportal.web.utils.idmanagement.MdsIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationInvitationApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var organizationMetadataService: OrganizationMetadataService

    @Inject
    lateinit var mdsIdUtils: MdsIdUtils

    fun inviteOrganization(invitationInformation: InviteOrganizationRequest, adminUserId: String): IdResponse {
        val mdsId = mdsIdUtils.generateMdsId()
        val userId = createKeycloakUserAndOrganization(mdsId, invitationInformation)
        createDbUserAndOrganization(userId, mdsId, invitationInformation)
        keycloakService.sendInvitationEmailWithPasswordReset(userId)

        Log.info("Invited organization and corresponding initial Participant Admin. mdsId=$mdsId, userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(mdsId)
    }

    private fun createKeycloakUserAndOrganization(mdsId: String, invitationInformation: InviteOrganizationRequest): String {
        val userId = keycloakService.createUser(
            invitationInformation.userEmail,
            invitationInformation.userFirstName,
            invitationInformation.userLastName
        )
        keycloakService.createOrganization(mdsId)
        keycloakService.joinOrganization(userId, mdsId, OrganizationRole.PARTICIPANT_ADMIN)

        return userId
    }

    private fun createDbUserAndOrganization(userId: String, mdsId: String, invitationInformation: InviteOrganizationRequest) {
        val user = userService.createUser(
            userId = userId,
            userData = buildUserData(invitationInformation),
            onboardingType = UserOnboardingType.INVITATION
        )
        organizationService.createInvitedOrganization(
            userId,
            mdsId,
            invitationInformation.orgName
        )
        user.organizationMdsId = mdsId
        user.update()

        organizationMetadataService.pushOrganizationMetadataToBroker()
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
