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
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.utils.TimeUtils
import de.sovity.authorityportal.web.utils.unauthorized
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class OrganizationRegistrationApiService(
    val organizationService: OrganizationService,
    val userService: UserService,
    val timeUtils: TimeUtils
) {

    fun approveOrganization(organizationId: String, userId: String): IdResponse {
        requirePending(organizationId, userId)

        val org = organizationService.getOrganizationOrThrow(organizationId)
        org.registrationStatus = OrganizationRegistrationStatus.ACTIVE
        org.update()

        val user = userService.getUserOrThrow(org.createdBy)
        user.registrationStatus = UserRegistrationStatus.ACTIVE
        user.update()

        Log.info("Approved organization and user. organizationId=$organizationId, userId=$userId.")

        return IdResponse(organizationId, timeUtils.now())
    }

    fun rejectOrganization(organizationId: String, userId: String): IdResponse {
        requirePending(organizationId, userId)

        val org = organizationService.getOrganizationOrThrow(organizationId)
        org.registrationStatus = OrganizationRegistrationStatus.REJECTED
        org.update()

        val user = userService.getUserOrThrow(org.createdBy)
        user.registrationStatus = UserRegistrationStatus.REJECTED
        user.update()

        Log.info("Rejected organization and user. organizationId=$organizationId, userId=$userId.")

        return IdResponse(organizationId, timeUtils.now())
    }

    private fun requirePending(organizationId: String, userId: String) {
        val org = organizationService.getOrganizationOrThrow(organizationId)
        val orgRegistrationStatus = org.registrationStatus
        val expectedRegistrationStatus = OrganizationRegistrationStatus.PENDING

        if (orgRegistrationStatus != expectedRegistrationStatus) {
            Log.error("Organization can not be approved/rejected. organizationId=$organizationId, orgRegistrationStatus=$orgRegistrationStatus, expectedRegistrationStatus=$expectedRegistrationStatus, userId=$userId.")
            unauthorized("Organization $organizationId is not in status PENDING")
        }
    }
}
