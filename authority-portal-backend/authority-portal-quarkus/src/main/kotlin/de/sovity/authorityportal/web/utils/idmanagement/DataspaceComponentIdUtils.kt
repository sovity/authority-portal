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
import org.jooq.impl.DSL

@ApplicationScoped
class DataspaceComponentIdUtils {

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var idUtils: IdUtils

    private val dataspaceComponentIdLength = 4

    fun generateDataspaceComponentId(mdsId: String): String {
        val usedDataspaceComponentIds = getUsedDataspaceComponentIds(mdsId)
        var dataspaceComponentId: String

        do {
            dataspaceComponentId = getDataspaceComponentIdCandidate(mdsId)
        } while (usedDataspaceComponentIds.contains(dataspaceComponentId))

        return dataspaceComponentId
    }

    private fun getDataspaceComponentIdCandidate(mdsId: String): String {
        val prefix = "$mdsId.C"
        val identifier = idUtils.randomIdentifier(dataspaceComponentIdLength)
        val checksum = idUtils.calculateVerificationDigits(identifier)
        return "$prefix$identifier$checksum"
    }

    private fun getUsedDataspaceComponentIds(mdsId: String): Set<String> {
        val c = Tables.CONNECTOR
        val connectorIds = dsl.select(c.CONNECTOR_ID.`as`("dataspaceComponentId"))
            .from(c)
            .where(c.MDS_ID.eq(mdsId))

        val cmp = Tables.COMPONENT
        val componentIds = dsl.select(cmp.ID.`as`("dataspaceComponentId"))
            .from(cmp)
            .where(cmp.MDS_ID.eq(mdsId))

        return connectorIds.unionAll(componentIds)
            .fetchSet(DSL.field("dataspaceComponentId", String::class.java))
    }
}
