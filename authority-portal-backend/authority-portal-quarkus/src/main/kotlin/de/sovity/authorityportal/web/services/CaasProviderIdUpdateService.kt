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
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext

@ApplicationScoped
class CaasProviderIdUpdateService(
    val dsl: DSLContext,
    val organizationService: OrganizationService
) {

    @Scheduled(every = "24h")
    fun updateMissingProviderIds() {
        val c = Tables.CONNECTOR
        val connectors = dsl.selectFrom(c)
            .where(c.PROVIDER_ORGANIZATION_ID.isNull, c.TYPE.eq(ConnectorType.CAAS))
            .fetch()
            .toSet()

        if (connectors.isNotEmpty()) {
            val orgId = organizationService.getOrganizationIdByName("sovity GmbH")

            connectors.forEach {
                it.providerOrganizationId = orgId
            }
            dsl.batchUpdate(connectors).execute()
        }
    }
}
