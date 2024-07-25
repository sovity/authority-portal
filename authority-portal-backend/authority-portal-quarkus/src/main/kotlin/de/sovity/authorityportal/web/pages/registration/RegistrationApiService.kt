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

package de.sovity.authorityportal.web.pages.registration

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.RegistrationRequestDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.web.model.CreateOrganizationData
import de.sovity.authorityportal.web.model.CreateUserData
import de.sovity.authorityportal.web.pages.organizationmanagement.toDb
import de.sovity.authorityportal.web.services.FirstUserService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import de.sovity.authorityportal.web.utils.TimeUtils
import de.sovity.authorityportal.web.utils.idmanagement.OrganizationIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class RegistrationApiService(
    val keycloakService: KeycloakService,
    val organizationService: OrganizationService,
    val userService: UserService,
    val organizationIdUtils: OrganizationIdUtils,
    val firstUserService: FirstUserService,
    val timeUtils: TimeUtils
) {

    fun registerUserAndOrganization(registrationRequest: RegistrationRequestDto): IdResponse {
        val organizationId = organizationIdUtils.generateOrganizationId()
        val userId = createKeycloakUserAndOrganization(organizationId, registrationRequest)
        createDbUserAndOrganization(userId, organizationId, registrationRequest)
        keycloakService.sendInvitationEmail(userId)
        firstUserService.setupFirstUserIfRequired(userId, organizationId)

        Log.info("Register organization and User. organizationId=$organizationId, userId=$userId")

        return IdResponse(userId, timeUtils.now())
    }

    private fun createKeycloakUserAndOrganization(organizationId: String, registrationRequest: RegistrationRequestDto): String {
        val userId = keycloakService.createUser(
            email = registrationRequest.userEmail,
            firstName = registrationRequest.userFirstName,
            lastName = registrationRequest.userLastName,
            password = registrationRequest.userPassword
        )
        keycloakService.createOrganization(organizationId)
        keycloakService.joinOrganization(userId, organizationId, OrganizationRole.PARTICIPANT_ADMIN)

        return userId
    }

    private fun createDbUserAndOrganization(
        userId: String,
        organizationId: String,
        registrationRequest: RegistrationRequestDto
    ) {
        val user = userService.createUser(
            userId = userId,
            userData = buildUserData(registrationRequest),
            onboardingType = UserOnboardingType.SELF_REGISTRATION
        )
        organizationService.createOrganization(
            userId = userId,
            organizationId = organizationId,
            organizationData = buildOrganizationData(registrationRequest),
            registrationStatus = OrganizationRegistrationStatus.PENDING
        )
        user.organizationId = organizationId
        user.update()
    }

    private fun buildUserData(registrationRequest: RegistrationRequestDto): CreateUserData {
        return CreateUserData().apply {
            email = registrationRequest.userEmail
            firstName = registrationRequest.userFirstName
            lastName = registrationRequest.userLastName
            jobTitle = registrationRequest.userJobTitle
            phone = registrationRequest.userPhone
        }
    }

    private fun buildOrganizationData(registrationRequest: RegistrationRequestDto): CreateOrganizationData {
        return CreateOrganizationData().apply {
            name = registrationRequest.organizationName
            url = registrationRequest.organizationUrl
            businessUnit = registrationRequest.organizationBusinessUnit
            industry = registrationRequest.organizationIndustry
            address = registrationRequest.organizationAddress
            billingAddress = registrationRequest.organizationBillingAddress
            description = registrationRequest.organizationDescription
            legalIdType = registrationRequest.organizationLegalIdType.toDb()
            legalIdNumber = registrationRequest.organizationLegalIdNumber
            commerceRegisterLocation = registrationRequest.organizationCommerceRegisterLocation
            mainContactName = registrationRequest.organizationMainContactName
            mainContactEmail = registrationRequest.organizationMainContactEmail
            mainContactPhone = registrationRequest.organizationMainContactPhone
            techContactName = registrationRequest.organizationTechContactName
            techContactEmail = registrationRequest.organizationTechContactEmail
            techContactPhone = registrationRequest.organizationTechContactPhone
        }
    }
}
