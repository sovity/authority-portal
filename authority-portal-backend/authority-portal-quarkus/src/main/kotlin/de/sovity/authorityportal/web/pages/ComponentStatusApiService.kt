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
import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus.UP
import de.sovity.authorityportal.db.jooq.enums.ComponentType
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.db.jooq.tables.records.ComponentDowntimesRecord
import de.sovity.authorityportal.web.services.ComponentStatusService
import de.sovity.authorityportal.web.services.connector.ConnectorStatusQuery
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.toDto
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext
import java.time.Duration
import java.time.Duration.between
import java.time.OffsetDateTime

@ApplicationScoped
class ComponentStatusApiService(
    val componentStatusService: ComponentStatusService,
    val connectorStatusQuery: ConnectorStatusQuery,
    val dsl: DSLContext,
    val timeUtils: TimeUtils
) {

    fun getComponentsStatus(environmentId: String): ComponentStatusOverview {
        val connectorStatuses = connectorStatusQuery.getConnectorStatusInfoByEnvironment(environmentId)
        val statusCount = countConnectorStatuses(connectorStatuses)

        return buildComponenStatusOverview(statusCount, environmentId)
    }

    fun getComponentsStatusForOrganizationId(environmentId: String, organizationId: String): ComponentStatusOverview {
        val connectorStatuses =
            connectorStatusQuery.getConnectorStatusInfoByOrganizationIdAndEnvironment(organizationId, environmentId)
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
        val latestBrokerCrawlerStatus =
            componentStatusService.getLatestComponentStatus(ComponentType.CATALOG_CRAWLER, environmentId)
        val now = timeUtils.now()

        return ComponentStatusOverview(
            dapsStatus = calculateUptimeStatus(latestDapsStatus, environmentId, now),
            loggingHouseStatus = calculateUptimeStatus(latestLoggingHouseStatus, environmentId, now),
            crawlerStatus = calculateUptimeStatus(latestBrokerCrawlerStatus, environmentId, now),
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

        val upSince = between(latestStatus.timeStamp.toInstant(), now.toInstant()).abs()
        val timeSpan = Duration.ofDays(30)

        return UptimeStatusDto(
            componentStatus = latestStatus.status.toDto(),
            upSinceSeconds = upSince.toSeconds().takeIf { latestStatus.status == UP } ?: 0,
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

        val statusHistoryAsc = componentStatusService.getStatusHistoryAscSince(component, limit, environmentId)

        if (statusHistoryAsc.isEmpty()) return 0.0

        val first = statusHistoryAsc.first()

        val start = when {
            first.timeStamp.isBefore(limit) -> ComponentDowntimesRecord(component, first.status, environmentId, limit)
            else -> first
        }

        val middle = statusHistoryAsc.drop(1)
        val end = ComponentDowntimesRecord(component, statusHistoryAsc.last().status, environmentId, now)

        val whole = listOf(start) + middle + listOf(end)

        val duration = whole.zipWithNext().fold(Duration.ZERO) { acc, (start, end) ->
            when (start.status) {
                UP -> acc + between(start.timeStamp, end.timeStamp)
                else -> acc
            }
        }

        val uptime = 100.0 * duration.toMillis() / between(start.timeStamp, now).toMillis()

        return uptime
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
