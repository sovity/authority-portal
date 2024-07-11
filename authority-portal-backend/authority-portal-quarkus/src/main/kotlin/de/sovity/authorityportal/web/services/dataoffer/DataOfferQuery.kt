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

package de.sovity.authorityportal.web.services.dataoffer

import com.github.t9t.jooq.json.JsonDSL
import com.github.t9t.jooq.json.JsonbDSL
import de.sovity.authorityportal.api.model.catalog.ConnectorOnlineStatusDto
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.edc.ext.wrapper.api.common.model.DataSourceAvailability
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext
import org.jooq.JSONB
import org.jooq.Record2
import org.jooq.impl.DSL
import java.time.OffsetDateTime

@ApplicationScoped
class DataOfferQuery(
    val dsl: DSLContext
) {

    fun getConnectorCountsByMdsIdsForEnvironment(environmentId: String): Map<String, Int> {
        val c = Tables.CONNECTOR

        return dsl.select(c.MDS_ID, DSL.count())
            .from(c)
            .where(c.ENVIRONMENT.eq(environmentId))
            .groupBy(c.MDS_ID)
            .fetchMap(c.MDS_ID, DSL.count())
    }

    fun getDataOfferCountsByMdsIdsForEnvironment(environmentId: String): Map<String, Map<DataSourceAvailability, Int>> {
        val c = Tables.CONNECTOR
        val d = Tables.DATA_OFFER

        val dataSourceAvailabilityField = JsonbDSL.fieldByKeyText(d.UI_ASSET_JSON, "dataSourceAvailability")

        val dataOffers = dsl.select(c.MDS_ID,  dataSourceAvailabilityField)
            .from(d)
            .innerJoin(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
            .where(c.ENVIRONMENT.eq(environmentId))
            .fetch()

        return dataOffers
            .groupingBy { it.value1() }
            .fold(mutableListOf<DataSourceAvailability>()) { acc, e -> acc.also { it.add(toDataSourceAvailability(e)) } }
            .mapValues { it.value.groupingBy{ e -> e }.eachCount() }

    }

    fun getDataOfferCountsForMdsIdAndEnvironment(environmentId: String, mdsId: String): Map<String, Int> {
        val c = Tables.CONNECTOR
        val d = Tables.DATA_OFFER

        val dataSourceAvailabilityField = JsonbDSL.fieldByKeyText(d.UI_ASSET_JSON, "dataSourceAvailability")
        val count = DSL.count(d.ASSET_ID).`as`("offerCount")

        return dsl.select(dataSourceAvailabilityField, count)
            .from(d)
            .join(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
            .where(c.ENVIRONMENT.eq(environmentId))
            .and(c.MDS_ID.eq(mdsId))
            .groupBy(dataSourceAvailabilityField)
            .fetchMap(dataSourceAvailabilityField, count)
    }

    private fun toDataSourceAvailability(e: Record2<String, String>) =
        when(val v = e.value2()) {
            "LIVE" -> DataSourceAvailability.LIVE
            "ON_REQUEST" -> DataSourceAvailability.ON_REQUEST
            else -> throw IllegalStateException("Don't know how to convert $v to " + DataSourceAvailability::class.java.canonicalName)
        }

    data class DataOfferInfoRs(
        val connectorId: String,
        val mdsId: String,
        val onlineStatus: ConnectorOnlineStatusDto,
        val offlineSinceOrLastUpdatedAt: OffsetDateTime,
        val dataOfferName: String,
        val dataOfferId: String,
        val dataSourceAvailability: String
    )

    fun getDataOffersForConnectorIdsAndEnvironment(environmentId: String, connectorIds: List<String>): List<DataOfferInfoRs> {
        val c = Tables.CONNECTOR
        val d = Tables.DATA_OFFER

        val dataSourceAvailabilityField = JsonbDSL.fieldByKeyText(d.UI_ASSET_JSON, "dataSourceAvailability")

        return dsl.select(c.CONNECTOR_ID, c.MDS_ID, c.ONLINE_STATUS, c.LAST_SUCCESSFUL_REFRESH_AT, d.ASSET_TITLE, d.ASSET_ID, dataSourceAvailabilityField)
            .from(d)
            .join(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
            .where(c.ENVIRONMENT.eq(environmentId))
            .fetchInto(DataOfferInfoRs::class.java)
    }
}
