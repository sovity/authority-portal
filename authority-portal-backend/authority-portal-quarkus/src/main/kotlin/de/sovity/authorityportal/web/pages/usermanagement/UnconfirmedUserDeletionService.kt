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

import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.utils.TimeUtils
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty

@ApplicationScoped
class UnconfirmedUserDeletionService(
    val userService: UserService,
    val keycloakService: KeycloakService,
    val organizationService: OrganizationService,
    val timeUtils: TimeUtils,
    @ConfigProperty(name = "authority-portal.invitation.expiration") val inviteExpirationTime: String
) {

    @Transactional
    @Scheduled(every = "15m")
    fun deleteUnconfirmedUsersAndOrganizations() {
        val expirationCutoffTime = timeUtils.now().minusSeconds(inviteExpirationTime.toLong())

        userService.removeMdsIdFromUnconfirmedUsers(expirationCutoffTime)

        val unconfirmedMdsIds = organizationService.getUnconfirmedOrganizationMdsIds(expirationCutoffTime)
        val deletedOrgsAmount = organizationService.deleteUnconfirmedOrganizations(unconfirmedMdsIds)
        Log.info("Deleted unconfirmed organizations in DB. amount=$deletedOrgsAmount.")
        unconfirmedMdsIds.forEach { mdsId ->
            keycloakService.deleteOrganization(mdsId)
            Log.info("Deleted unconfirmed organization in Keycloak. mdsId=$mdsId.")
        }

        val unconfirmedUserIds = userService.getUnconfirmedUserIds(expirationCutoffTime)
        val deletedUsersAmount = userService.deleteUnconfirmedUsers(unconfirmedUserIds)
        Log.info("Deleted unconfirmed users in DB. amount=$deletedUsersAmount.")
        unconfirmedUserIds.forEach { userId ->
            keycloakService.deleteUser(userId)
            Log.info("Deleted unconfirmed user in Keycloak. userId=$userId.")
        }
    }
}
