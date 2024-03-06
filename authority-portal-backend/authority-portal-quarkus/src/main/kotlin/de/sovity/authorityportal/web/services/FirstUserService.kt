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

package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.ApplicationRole
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.util.concurrent.atomic.AtomicBoolean

@ApplicationScoped
class FirstUserService {

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var organizationService: OrganizationService

    val isFirstUserHandled = AtomicBoolean(false)

    fun setupFirstUserIfRequired(userId: String, mdsId: String) {
        if (isFirstUserHandled.compareAndSet(false, true) && isFirstUser(userId)) {
            setupFirstUser(userId, mdsId)
        }
    }

    private fun setupFirstUser(userId: String, mdsId: String) {
        keycloakService.joinApplicationRole(userId, ApplicationRole.AUTHORITY_ADMIN)
        userService.updateStatus(userId, UserRegistrationStatus.ACTIVE)
        organizationService.updateStatus(mdsId, OrganizationRegistrationStatus.ACTIVE)

        Log.info("First user was made ${ApplicationRole.AUTHORITY_ADMIN}. mdsId=$mdsId, userId=$userId")
    }

    private fun isFirstUser(userId: String): Boolean {
        val u = Tables.USER

        val count = dsl.fetchCount(dsl.selectFrom(u))
        if (count != 1) {
            return false
        }

        return dsl.fetchExists(dsl.selectFrom(u).where(u.ID.eq(userId)))
    }
}
