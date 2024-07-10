/*
 *  Copyright (c) 2023 sovity GmbH
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  SPDX-License-Identifier: Apache-2.0
 *
 *  Contributors:
 *       sovity GmbH - initial API and implementation
 *
 */
package de.sovity.authorityportal.broker.dao.pages.catalog

import de.sovity.authorityportal.broker.dao.utils.mapInline
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.tables.Connector
import de.sovity.authorityportal.db.jooq.tables.DataOffer
import de.sovity.authorityportal.db.jooq.tables.DataOfferViewCount
import de.sovity.authorityportal.db.jooq.tables.Organization
import de.sovity.authorityportal.web.environment.CatalogDataspaceConfig
import org.jooq.Field
import org.jooq.Table
import org.jooq.impl.DSL
import java.time.OffsetDateTime

/**
 * Tables and fields used in the catalog page query.
 *
 *
 * Having this as a class makes access to computed fields (e.g. asset properties) easier.
 */
class CatalogQueryFields(
    var connectorTable: Connector,
    var dataOfferTable: DataOffer,
    var organizationTable: Organization,
    private var dataOfferViewCountTable: DataOfferViewCount,
    private var dataSpaceConfigCatalog: CatalogDataspaceConfig
) {
    // Asset Properties from JSON to be used in sorting / filtering
    var dataSpace: Field<String>

    // This date should always be non-null
    // It's used in the UI to display the last relevant change date of a connector
    var offlineSinceOrLastUpdatedAt: Field<OffsetDateTime> = offlineSinceOrLastUpdatedAt(connectorTable)

    init {
        dataSpace = buildDataSpaceField(connectorTable, dataSpaceConfigCatalog)
    }

    private fun buildDataSpaceField(connectorTable: Connector, dataSpaceConfigCatalog: CatalogDataspaceConfig): Field<String> {
        return connectorTable.CONNECTOR_ID.mapInline(dataSpaceConfigCatalog.namesByConnectorId, dataSpaceConfigCatalog.defaultName)
    }

    fun withSuffix(additionalSuffix: String): CatalogQueryFields {
        return CatalogQueryFields(
            connectorTable.`as`(withSuffix(connectorTable, additionalSuffix)),
            dataOfferTable.`as`(withSuffix(dataOfferTable, additionalSuffix)),
            organizationTable.`as`(withSuffix(organizationTable, additionalSuffix)),
            dataOfferViewCountTable.`as`(withSuffix(dataOfferViewCountTable, additionalSuffix)),
            dataSpaceConfigCatalog
        )
    }

    private fun withSuffix(table: Table<*>, additionalSuffix: String): String {
        return "%s_%s".format(table.name, additionalSuffix)
    }

    val viewCount: Field<Int>
        get() {
            val subquery = DSL.select(DSL.count())
                .from(dataOfferViewCountTable)
                .where(
                    dataOfferViewCountTable.ASSET_ID.eq(dataOfferTable.ASSET_ID)
                        .and(dataOfferViewCountTable.CONNECTOR_ID.eq(connectorTable.CONNECTOR_ID))
                )

            return subquery.asField()
        }

    companion object {
        fun offlineSinceOrLastUpdatedAt(connectorTable: Connector): Field<OffsetDateTime> {
            return DSL.coalesce(
                connectorTable.LAST_SUCCESSFUL_REFRESH_AT,
                connectorTable.CREATED_AT
            )
        }
    }
}
