package de.sovity.authorityportal.web.services.dataoffer

import de.sovity.authorityportal.api.model.catalog.ConnectorOnlineStatusDto
import de.sovity.authorityportal.db.jooq.Tables
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext
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

    fun getDataOfferCountsByMdsIdsForEnvironment(environmentId: String): Map<String, Int> {
        val c = Tables.CONNECTOR
        val d = Tables.DATA_OFFER

        val count = DSL.count(d.ASSET_ID).`as`("offerCount")
        return dsl.select(c.MDS_ID, count)
            .from(d)
            .innerJoin(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
            .where(c.ENVIRONMENT.eq(environmentId))
            .groupBy(c.MDS_ID)
            .fetchMap(c.MDS_ID, count)
    }

    fun getDataOfferCountsForMdsIdAndEnvironment(environmentId: String, mdsId: String): Int {
        val c = Tables.CONNECTOR
        val d = Tables.DATA_OFFER

        return dsl.selectCount()
            .from(c)
            .join(d).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
            .where(c.ENVIRONMENT.eq(environmentId))
            .and(c.MDS_ID.eq(mdsId))
            .fetchOne(0, Int::class.java)
            ?: 0
    }

    data class DataOfferInfoRs(
        val connectorId: String,
        val mdsId: String,
        val onlineStatus: ConnectorOnlineStatusDto,
        val offlineSinceOrLastUpdatedAt: OffsetDateTime,
        val dataOfferName: String,
        val dataOfferId: String
    )

    fun getDataOffersForConnectorIdsAndEnvironment(environmentId: String, connectorIds: List<String>): List<DataOfferInfoRs> {
        val c = Tables.CONNECTOR
        val d = Tables.DATA_OFFER

        return dsl.select(c.CONNECTOR_ID, c.MDS_ID, c.ONLINE_STATUS, c.LAST_SUCCESSFUL_REFRESH_AT, d.ASSET_TITLE, d.ASSET_ID)
            .from(d)
            .join(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
            .where(c.ENVIRONMENT.eq(environmentId))
            .fetchInto(DataOfferInfoRs::class.java)
    }
}
