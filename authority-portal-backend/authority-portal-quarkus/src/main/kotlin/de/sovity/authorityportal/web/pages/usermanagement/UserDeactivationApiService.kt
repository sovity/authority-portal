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
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.utils.TimeUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class UserDeactivationApiService(
    val keycloakService: KeycloakService,
    val userService: UserService,
    val timeUtils: TimeUtils
) {

    fun deactivateUser(userId: String, adminUserId: String): IdResponse {
        keycloakService.deactivateUser(userId)
        setUserActivationStatus(userId, UserRegistrationStatus.DEACTIVATED)

        keycloakService.forceLogout(userId)

        Log.info("User deactivated. userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(userId, timeUtils.now())
    }

    fun reactivateUser(userId: String, adminUserId: String): IdResponse {
        keycloakService.reactivateUser(userId)
        setUserActivationStatus(userId, UserRegistrationStatus.ACTIVE)

        keycloakService.forceLogout(userId)

        Log.info("User reactivated. userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(userId, timeUtils.now())
    }

    private fun setUserActivationStatus(userId: String, status: UserRegistrationStatus) {
        val user = userService.getUserOrThrow(userId)
        user.registrationStatus = status
        user.update()
    }
}
