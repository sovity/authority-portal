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

package de.sovity.authorityportal.web.utils.idmanagement

import de.sovity.authorityportal.db.jooq.Tables
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.util.Locale

@ApplicationScoped
class ClientIdUtils {
    @Inject
    lateinit var dsl: DSLContext

    fun generateFromConnectorId(connectorId: String): String {
        return connectorId
            .replace(".", "-")
            .lowercase(Locale.getDefault())
    }

    fun exists(clientId: String): Boolean {
        val c = Tables.CONNECTOR
        val connectorClientIds = dsl.select(c.CLIENT_ID.`as`("clientId"))
            .from(c)
            .where(c.CLIENT_ID.eq(clientId))

        val cmp = Tables.COMPONENT
        val centralComponentClientIds = dsl.select(cmp.CLIENT_ID.`as`("clientId"))
            .from(cmp)
            .where(cmp.CLIENT_ID.eq(clientId))

        return dsl.fetchExists(connectorClientIds.unionAll(centralComponentClientIds))
    }
}
