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
import org.jooq.DSLContext
import org.jooq.impl.DSL

@ApplicationScoped
class DataspaceComponentIdUtils(
    val dsl: DSLContext,
    val idUtils: IdUtils,
) {
    private val dataspaceComponentIdLength = 4

    fun generateDataspaceComponentId(organizationId: String): String {
        val usedDataspaceComponentIds = getUsedDataspaceComponentIds(organizationId)
        var dataspaceComponentId: String

        do {
            dataspaceComponentId = getDataspaceComponentIdCandidate(organizationId)
        } while (usedDataspaceComponentIds.contains(dataspaceComponentId))

        return dataspaceComponentId
    }

    private fun getDataspaceComponentIdCandidate(organizationId: String): String {
        val prefix = "$organizationId.C"
        val identifier = idUtils.randomIdentifier(dataspaceComponentIdLength)
        val checksum = idUtils.calculateVerificationDigits(identifier)
        return "$prefix$identifier$checksum"
    }

    private fun getUsedDataspaceComponentIds(organizationId: String): Set<String> {
        val c = Tables.CONNECTOR
        val connectorIds = dsl.select(c.CONNECTOR_ID.`as`("dataspaceComponentId"))
            .from(c)
            .where(c.ORGANIZATION_ID.eq(organizationId))

        val cmp = Tables.COMPONENT
        val componentIds = dsl.select(cmp.ID.`as`("dataspaceComponentId"))
            .from(cmp)
            .where(cmp.ORGANIZATION_ID.eq(organizationId))

        return connectorIds.unionAll(componentIds)
            .fetchSet(DSL.field("dataspaceComponentId", String::class.java))
    }
}
