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

import de.sovity.authorityportal.api.model.UptimeStatusDto
import de.sovity.authorityportal.api.model.ComponentStatusOverview
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus.UP
import de.sovity.authorityportal.db.jooq.enums.ComponentType
import de.sovity.authorityportal.db.jooq.tables.records.ComponentDowntimesRecord
import de.sovity.authorityportal.web.services.ComponentStatusService
import de.sovity.authorityportal.web.services.ConnectorMetadataService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus.DEAD
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus.OFFLINE
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus.ONLINE
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.toDto
import de.sovity.authorityportal.web.utils.idmanagement.DataspaceComponentIdUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.time.Duration
import java.time.Duration.between
import java.time.OffsetDateTime
import java.util.Locale

@ApplicationScoped
class ComponentStatusApiService {

    @Inject
    lateinit var connectorMetadataService: ConnectorMetadataService

    @Inject
    lateinit var componentStatusService: ComponentStatusService

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var dataspaceComponentIdUtils: DataspaceComponentIdUtils

    @Inject
    lateinit var dsl: DSLContext

    fun getComponentsStatus(environmentId: String): ComponentStatusOverview {
        val connectorMetadata = connectorMetadataService.getConnectorInfoByEnvironment(environmentId)

        val unknownConnectorCount = getNumberOfUnknownConnectors(connectorMetadata, environmentId)
        val connectorStatusCount = countConnectorStatuses(connectorMetadata, unknownConnectorCount)

        return buildComponenStatusOverview(connectorStatusCount, environmentId)
    }

    fun getComponentsStatusForMdsId(environmentId: String, mdsId: String): ComponentStatusOverview {
        val connectorMetadata = connectorMetadataService.getConnectorInfoByEnvironment(environmentId)
        val providedConnectorIds = connectorService.getProvidedConnectorsByMdsId(mdsId, environmentId).map { it.connectorId }
        val filteredMetadata = connectorMetadata.filter {
            dataspaceComponentIdUtils.toMdsId(it.participantId) == mdsId
                || it.participantId in providedConnectorIds
        }

        val unknownConnectorCount = getNumberOfUnknownConnectors(filteredMetadata, environmentId, mdsId)
        val connectorStatusCount = countConnectorStatuses(filteredMetadata, unknownConnectorCount)

        return buildComponenStatusOverview(connectorStatusCount, environmentId)
    }

    private fun buildComponenStatusOverview(connectorStatusCount: ConnectorStatusCount, environmentId: String): ComponentStatusOverview {
        val latestBrokerStatus = componentStatusService.getLatestComponentStatus(ComponentType.BROKER, environmentId)
        val latestDapsStatus = componentStatusService.getLatestComponentStatus(ComponentType.DAPS, environmentId)
        val latestLoggingHouseStatus = componentStatusService.getLatestComponentStatus(ComponentType.LOGGING_HOUSE, environmentId)
        val now = OffsetDateTime.now()

        return ComponentStatusOverview().also {
            it.brokerStatus = calculateUptimeStatus(latestBrokerStatus, environmentId, now)
            it.dapsStatus = calculateUptimeStatus(latestDapsStatus, environmentId, now)
            it.loggingHouseStatus = calculateUptimeStatus(latestLoggingHouseStatus, environmentId, now)
            it.onlineConnectors = connectorStatusCount.online
            it.disturbedConnectors = connectorStatusCount.disturbed
            it.offlineConnectors = connectorStatusCount.offline
        }
    }

    private fun calculateUptimeStatus(latestStatus: ComponentDowntimesRecord?, environmentId: String, now: OffsetDateTime): UptimeStatusDto? {
        if (latestStatus == null) {
            return null
        }

        val upSince = Duration.between(latestStatus.timeStamp.toInstant(), now.toInstant()).abs()
        val timeSpan = Duration.ofDays(30)

        return UptimeStatusDto().also {
            it.componentStatus = latestStatus.status.toDto()
            it.upSinceSeconds = upSince.toSeconds().takeIf { latestStatus.status == ComponentOnlineStatus.UP } ?: 0
            it.timeSpanSeconds = timeSpan.toSeconds()
            it.uptimePercentage = calculateUptimePercentage(latestStatus.component, timeSpan, environmentId, now)
        }
    }

    private fun calculateUptimePercentage(
        component: ComponentType,
        timeSpan: Duration,
        environmentId: String,
        now: OffsetDateTime
    ): Double {
        val limit = now.minus(timeSpan)

        val statusHistoryAsc = componentStatusService.getStatusHistoryAscSince(component, limit, environmentId)

        val first = statusHistoryAsc.first()

        val head = when {
            first.timeStamp.isBefore(limit) -> ComponentDowntimesRecord(component, first.status, environmentId, limit)
            else -> first
        }

        val body = statusHistoryAsc.drop(1)
        val tail = ComponentDowntimesRecord(component, statusHistoryAsc.last().status, environmentId, now)

        val whole = listOf(head) + body + listOf(tail)

        val duration = whole.zipWithNext().fold(Duration.ZERO) { acc, (start, end) ->
            when (start.status) {
                UP -> acc + between(start.timeStamp, end.timeStamp)
                else -> acc
            }
        }

        val uptime = 100.0 * duration.toMillis() / between(head.timeStamp, now).toMillis()

        return uptime
    }

    private fun countConnectorStatuses(
        connectorMetadata: List<AuthorityPortalConnectorInfo>,
        unknownCount: Int,
    ): ConnectorStatusCount {
        val onlineCount = connectorMetadata.count { it.onlineStatus == ONLINE }
        val disturbedCount = connectorMetadata.count {
            (it.onlineStatus == OFFLINE || it.onlineStatus == DEAD)
                && it.offlineSinceOrLastUpdatedAt != null
                && it.offlineSinceOrLastUpdatedAt!!.isAfter(OffsetDateTime.now().minusMinutes(2))
        }
        val offlineCount = connectorMetadata.count { it.onlineStatus == OFFLINE || it.onlineStatus == DEAD } - disturbedCount + unknownCount
        return ConnectorStatusCount(onlineCount, disturbedCount, offlineCount)
    }

    private fun getNumberOfUnknownConnectors(connectorMetadata: List<AuthorityPortalConnectorInfo>, environmentId: String, mdsId: String? = null): Int {
        val c = Tables.CONNECTOR

        val conditions = mutableListOf(
            c.ENVIRONMENT.eq(environmentId),
            DSL.or(
                c.ENDPOINT_URL.isNull,
                c.ENDPOINT_URL.notIn(connectorMetadata.map { it.connectorEndpoint })
            )
        )
        if (mdsId != null) {
            conditions += DSL.or(c.MDS_ID.eq(mdsId), c.PROVIDER_MDS_ID.eq(mdsId))
        }

        return dsl.selectCount().from(c).where(conditions).fetchSingle().value1()
    }

    data class ConnectorStatusCount(
        val online: Int,
        val disturbed: Int,
        val offline: Int
    )
}
