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

package de.sovity.authorityportal.web.services.connector

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext
import org.jooq.impl.DSL
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
            .where(
                c.ENVIRONMENT.eq(environmentId),
                DSL.or(c.MDS_ID.eq(mdsId), c.PROVIDER_MDS_ID.eq(mdsId))
            )
            .fetchInto(ConnectorStatusInfoRs::class.java)
    }
}
