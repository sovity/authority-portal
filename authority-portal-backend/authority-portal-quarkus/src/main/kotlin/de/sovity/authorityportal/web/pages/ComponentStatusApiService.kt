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

package de.sovity.authorityportal.web.pages

import de.sovity.authorityportal.api.model.ComponentStatusOverview
import de.sovity.authorityportal.api.model.UptimeStatusDto
import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ComponentType
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.db.jooq.tables.records.ComponentDowntimesRecord
import de.sovity.authorityportal.web.services.ComponentStatusService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.connector.ConnectorStatusQuery
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.toDto
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.time.Duration
import java.time.OffsetDateTime
import java.util.Locale

@ApplicationScoped
class ComponentStatusApiService(
    val componentStatusService: ComponentStatusService,
    val connectorService: ConnectorService,
    val connectorStatusQuery: ConnectorStatusQuery,
    val dsl: DSLContext,
    val timeUtils: TimeUtils
) {

    fun getComponentsStatus(environmentId: String): ComponentStatusOverview {
        val connectorStatuses = connectorStatusQuery.getConnectorStatusInfoByEnvironment(environmentId)
        val statusCount = countConnectorStatuses(connectorStatuses)

        return buildComponenStatusOverview(statusCount, environmentId)
    }

    fun getComponentsStatusForMdsId(environmentId: String, mdsId: String): ComponentStatusOverview {
        val connectorStatuses = connectorStatusQuery.getConnectorStatusInfoByMdsIdAndEnvironment(mdsId, environmentId)
        val statusCount = countConnectorStatuses(connectorStatuses)

        return buildComponenStatusOverview(statusCount, environmentId)
    }

    private fun buildComponenStatusOverview(
        connectorStatusCount: ConnectorStatusCount,
        environmentId: String
    ): ComponentStatusOverview {
        val latestDapsStatus = componentStatusService.getLatestComponentStatus(ComponentType.DAPS, environmentId)
        val latestLoggingHouseStatus =
            componentStatusService.getLatestComponentStatus(ComponentType.LOGGING_HOUSE, environmentId)
        val now = timeUtils.now()

        return ComponentStatusOverview(
            dapsStatus = calculateUptimeStatus(latestDapsStatus, environmentId, now),
            loggingHouseStatus = calculateUptimeStatus(latestLoggingHouseStatus, environmentId, now),
            onlineConnectors = connectorStatusCount.online,
            disturbedConnectors = connectorStatusCount.disturbed,
            offlineConnectors = connectorStatusCount.offline
        )

    }

    private fun calculateUptimeStatus(
        latestStatus: ComponentDowntimesRecord?,
        environmentId: String,
        now: OffsetDateTime
    ): UptimeStatusDto? {
        if (latestStatus == null) {
            return null
        }

        val upSince = Duration.between(latestStatus.timeStamp.toInstant(), now.toInstant()).abs()
        val timeSpan = Duration.ofDays(30)

        return UptimeStatusDto(
            componentStatus = latestStatus.status.toDto(),
            upSinceSeconds = upSince.toSeconds().takeIf { latestStatus.status == ComponentOnlineStatus.UP } ?: 0,
            timeSpanSeconds = timeSpan.toSeconds(),
            uptimePercentage = calculateUptimePercentage(latestStatus.component, timeSpan, environmentId, now)
        )
    }

    private fun calculateUptimePercentage(
        component: ComponentType,
        timeSpan: Duration,
        environmentId: String,
        now: OffsetDateTime
    ): Double {
        val limit = now.minus(timeSpan)
        var statusHistoryAsc = componentStatusService.getStatusHistoryAscSince(component, limit, environmentId)
        // If no status was found before the limit, the first record in the history is used as base for the calculation
        val initialRecord =
            componentStatusService.getFirstRecordBefore(component, limit, environmentId) ?: statusHistoryAsc.first()

        // If no "UP" status was found, return 0.00
        // Also, drop all entries before first "UP" status, to avoid wrong uptime calculation
        var tmpLastUpStatus = if (initialRecord.status == ComponentOnlineStatus.UP) initialRecord else {
            statusHistoryAsc = statusHistoryAsc.dropWhile { it.status != ComponentOnlineStatus.UP }
            statusHistoryAsc.firstOrNull()
        }

        if (tmpLastUpStatus == null) {
            return 0.00
        }

        // Sum up the total duration of "UP" statuses
        var totalUptimeDuration = Duration.ZERO
        for (componentRecord in statusHistoryAsc) {
            if (componentRecord.status == ComponentOnlineStatus.UP) {
                tmpLastUpStatus = componentRecord
            } else {
                totalUptimeDuration += Duration.between(
                    tmpLastUpStatus!!.timeStamp.toInstant(),
                    componentRecord.timeStamp.toInstant()
                ).abs()
            }
        }

        // Add time if last status is "UP"
        val lastRecord = statusHistoryAsc.lastOrNull() ?: tmpLastUpStatus
        if (lastRecord!!.status == ComponentOnlineStatus.UP) {
            totalUptimeDuration += Duration.between(lastRecord.timeStamp.toInstant(), now.toInstant()).abs()
        }

        // Subtract potential uptime before the limit
        if (initialRecord.status == ComponentOnlineStatus.UP && initialRecord.timeStamp.isBefore(limit)) {
            totalUptimeDuration -= Duration.between(initialRecord.timeStamp.toInstant(), limit.toInstant()).abs()
        }

        // Calculate uptime percentage
        val totalDuration =
            Duration.between(initialRecord.timeStamp.toInstant(), now.toInstant()).coerceAtMost(timeSpan).abs()
        val uptimePercentage = totalUptimeDuration.toMillis().toDouble() / totalDuration.toMillis().toDouble() * 100

        // Round value to two decimal places
        val symbols = DecimalFormatSymbols(Locale.US)
        val formatter = DecimalFormat("#.##", symbols)
        return formatter.format(uptimePercentage).toDouble()
    }

    private fun countConnectorStatuses(
        connectorStatuses: List<ConnectorStatusQuery.ConnectorStatusInfoRs>
    ): ConnectorStatusCount {

        val onlineCount = connectorStatuses.count { it.onlineStatus == ConnectorOnlineStatus.ONLINE }
        val disturbedCount = connectorStatuses.count {
            (it.onlineStatus == ConnectorOnlineStatus.OFFLINE || it.onlineStatus == ConnectorOnlineStatus.DEAD)
                && it.lastSuccessfulRefreshAt != null
                && it.lastSuccessfulRefreshAt.isAfter(timeUtils.now().minusMinutes(2))
        }
        val offlineCount = connectorStatuses.count {
            it.onlineStatus == ConnectorOnlineStatus.OFFLINE || it.onlineStatus == ConnectorOnlineStatus.DEAD
        } - disturbedCount

        return ConnectorStatusCount(onlineCount, disturbedCount, offlineCount)
    }

    data class ConnectorStatusCount(
        val online: Int,
        val disturbed: Int,
        val offline: Int
    )
}
