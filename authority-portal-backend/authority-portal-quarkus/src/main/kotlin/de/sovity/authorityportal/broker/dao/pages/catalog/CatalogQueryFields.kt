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

import de.sovity.authorityportal.broker.services.config.DataSpaceConfig
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.tables.Connector
import de.sovity.authorityportal.db.jooq.tables.DataOffer
import de.sovity.authorityportal.db.jooq.tables.DataOfferViewCount
import lombok.AccessLevel
import lombok.Getter
import lombok.experimental.FieldDefaults
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
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
class CatalogQueryFields(
    var connectorTable: Connector,
    var dataOfferTable: DataOffer,
    private var dataOfferViewCountTable: DataOfferViewCount,
    private var dataSpaceConfig: DataSpaceConfig
) {
    // Asset Properties from JSON to be used in sorting / filtering
    var dataSpace: Field<String>

    // This date should always be non-null
    // It's used in the UI to display the last relevant change date of a connector
    var offlineSinceOrLastUpdatedAt: Field<OffsetDateTime> = offlineSinceOrLastUpdatedAt(connectorTable)

    init {
        dataSpace = buildDataSpaceField(connectorTable, dataSpaceConfig)
    }

    private fun buildDataSpaceField(connectorTable: Connector, dataSpaceConfig: DataSpaceConfig): Field<String> {
        val endpoint = connectorTable.ENDPOINT_URL

        val connectors = dataSpaceConfig.dataSpaceConnectors
        if (connectors.isEmpty()) {
            return DSL.`val`(dataSpaceConfig.defaultDataSpace)
        }

        val first = connectors[0]
        var dspCase = DSL.case_(endpoint).`when`(first.endpoint, first.dataSpaceName)

        for (dsp in connectors.subList(1, connectors.size)) {
            dspCase = dspCase.`when`(dsp.endpoint, dsp.dataSpaceName)
        }

        return dspCase.else_(DSL.`val`(dataSpaceConfig.defaultDataSpace))
    }

    fun withSuffix(additionalSuffix: String): CatalogQueryFields {
        return CatalogQueryFields(
            connectorTable.`as`(withSuffix(connectorTable, additionalSuffix)),
            dataOfferTable.`as`(withSuffix(dataOfferTable, additionalSuffix)),
            dataOfferViewCountTable.`as`(withSuffix(dataOfferViewCountTable, additionalSuffix)),
            dataSpaceConfig
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

    val organizationName: Field<String>
        get() = organizationName(connectorTable.MDS_ID)

    companion object {
        fun offlineSinceOrLastUpdatedAt(connectorTable: Connector): Field<OffsetDateTime> {
            return DSL.coalesce(
                connectorTable.LAST_SUCCESSFUL_REFRESH_AT,
                connectorTable.CREATED_AT
            )
        }

        fun organizationName(mdsId: Field<String?>?): Field<String> {
            val o = Tables.ORGANIZATION
            return DSL.select(o.NAME)
                .from(o)
                .where(o.MDS_ID.eq(mdsId))
                .asField<Any>()
                .cast(String::class.java)
        }
    }
}
