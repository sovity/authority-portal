package de.sovity.authorityportal.web.services.connector

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext
import java.time.OffsetDateTime

@ApplicationScoped
class ConnectorStatusQuery(
    val dsl: DSLContext,
) {

    data class ConnectorStatusInfoRs(
        val connectorId: String,
        val onlineStatus: ConnectorOnlineStatus,
        val lastSuccessfulRefreshAt: OffsetDateTime?,
    )

    fun getConnectorStatusInfoByEnvironment(environmentId: String): List<ConnectorStatusInfoRs> {
        val c = Tables.CONNECTOR

        return dsl.select(c.CONNECTOR_ID, c.ONLINE_STATUS, c.LAST_SUCCESSFUL_REFRESH_AT)
            .from(c)
            .where(c.ENVIRONMENT.eq(environmentId))
            .fetchInto(ConnectorStatusInfoRs::class.java)
    }

    fun getConnectorStatusInfoByMdsIdAndEnvironment(mdsId: String, environmentId: String): List<ConnectorStatusInfoRs> {
        val c = Tables.CONNECTOR

        return dsl.select(c.CONNECTOR_ID, c.ONLINE_STATUS, c.LAST_SUCCESSFUL_REFRESH_AT)
            .from(c)
            .where(c.ENVIRONMENT.eq(environmentId))
            .and(c.MDS_ID.eq(mdsId))
            .or(c.PROVIDER_MDS_ID.eq(mdsId))
            .fetchInto(ConnectorStatusInfoRs::class.java)
    }
}
