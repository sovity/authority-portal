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

import com.github.t9t.jooq.json.JsonbDSL
import de.sovity.authorityportal.api.model.catalog.ConnectorOnlineStatusDto
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.tables.Connector
import de.sovity.edc.ext.wrapper.api.common.model.DataSourceAvailability
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.Condition
import org.jooq.DSLContext
import org.jooq.Field
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

    data class DataOfferCountRs(
        val mdsId: String,
        val liveOffers: Int,
        val onRequestOffers: Int
    )

    fun countAllOrganizationDataOffers(
        environmentId: String,
        conditionFn: (Connector) -> Condition = { DSL.trueCondition() }
    ): List<DataOfferCountRs> {
        val c = Tables.CONNECTOR

        return dsl.select(
            c.MDS_ID.`as`("mdsId"),
            getDataOfferCount(c.MDS_ID, environmentId, DataSourceAvailability.LIVE).`as`("liveOffers"),
            getDataOfferCount(c.MDS_ID, environmentId, DataSourceAvailability.ON_REQUEST).`as`("onRequestOffers")
        )
            .from(c)
            .where(conditionFn(c))
            .fetchInto(DataOfferCountRs::class.java)
    }

    private fun getDataOfferCount(
        mdsId: Field<String>,
        environmentId: String,
        dataSourceAvailability: DataSourceAvailability
    ): Field<Int> {
        val availability = JsonbDSL.fieldByKeyText(Tables.DATA_OFFER.UI_ASSET_JSON, "dataSourceAvailability")
        val isSameAvailability = when (dataSourceAvailability) {
            DataSourceAvailability.ON_REQUEST -> availability.eq("ON_REQUEST")
            DataSourceAvailability.LIVE -> availability.ne("ON_REQUEST").or(availability.isNull())
        }

        return DSL.select(DSL.coalesce(DSL.count(), DSL.`val`(0)))
            .from(Tables.DATA_OFFER)
            .join(Tables.CONNECTOR).on(Tables.CONNECTOR.CONNECTOR_ID.eq(Tables.DATA_OFFER.CONNECTOR_ID))
            .where(
                Tables.CONNECTOR.MDS_ID.eq(mdsId),
                Tables.CONNECTOR.ENVIRONMENT.eq(environmentId),
                isSameAvailability
            )
            .asField()
    }

    fun countOrganizationDataOffers(
        environmentId: String,
        mdsId: String
    ): DataOfferCountRs? =
        countAllOrganizationDataOffers(environmentId) { Tables.CONNECTOR.MDS_ID.eq(mdsId) }
            .singleOrNull()

    data class DataOfferInfoRs(
        val connectorId: String,
        val mdsId: String,
        val onlineStatus: ConnectorOnlineStatusDto,
        val offlineSinceOrLastUpdatedAt: OffsetDateTime,
        val dataOfferName: String,
        val dataOfferId: String,
        val dataSourceAvailability: String
    )

    fun getDataOffersForConnectorIdsAndEnvironment(
        environmentId: String,
        connectorIds: List<String>
    ): List<DataOfferInfoRs> {
        val c = Tables.CONNECTOR
        val d = Tables.DATA_OFFER

        val dataSourceAvailabilityField = JsonbDSL.fieldByKeyText(d.UI_ASSET_JSON, "dataSourceAvailability")

        return dsl.select(
            c.CONNECTOR_ID,
            c.MDS_ID,
            c.ONLINE_STATUS,
            c.LAST_SUCCESSFUL_REFRESH_AT.`as`("offlineSinceOrLastUpdatedAt"),
            d.ASSET_TITLE.`as`("dataOfferName"),
            d.ASSET_ID.`as`("dataOfferId"),
            dataSourceAvailabilityField.`as`("dataSourceAvailability")
        )
            .from(d)
            .join(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
            .where(c.ENVIRONMENT.eq(environmentId))
            .fetchInto(DataOfferInfoRs::class.java)
    }
}
