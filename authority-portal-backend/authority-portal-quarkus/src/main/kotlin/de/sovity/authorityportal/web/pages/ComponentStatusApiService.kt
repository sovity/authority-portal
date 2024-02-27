package de.sovity.authorityportal.web.pages

import de.sovity.authorityportal.api.model.UptimeStatusDto
import de.sovity.authorityportal.api.model.ComponentStatusOverview
import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ComponentType
import de.sovity.authorityportal.db.jooq.tables.records.ComponentDowntimesRecord
import de.sovity.authorityportal.web.services.ComponentStatusService
import de.sovity.authorityportal.web.services.ConnectorMetadataService
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus.DEAD
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus.OFFLINE
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus.ONLINE
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.toDto
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.time.Duration
import java.time.OffsetDateTime
import java.util.Locale

@ApplicationScoped
class ComponentStatusApiService {

    @Inject
    lateinit var connectorMetadataService: ConnectorMetadataService

    @Inject
    lateinit var componentStatusService: ComponentStatusService

    fun getComponentsStatus(environmentId: String): ComponentStatusOverview {
        val connectorMetadata = connectorMetadataService.getConnectorInfoByEnvironment(environmentId)
        val connectorStatusCount = countConnectorStatuses(connectorMetadata)

        return buildComponenStatusOverview(connectorStatusCount, environmentId)
    }

    fun getComponentsStatusForMdsId(environmentId: String, mdsId: String): ComponentStatusOverview {
        val connectorMetadata = connectorMetadataService.getConnectorInfoByMdsId(environmentId, mdsId)
        val connectorStatusCount = countConnectorStatuses(connectorMetadata)

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

        return UptimeStatusDto().also {
            it.componentStatus = latestStatus.status.toDto()
            it.upSince = upSince.takeIf { latestStatus.status == ComponentOnlineStatus.UP } ?: Duration.ZERO
            it.timeSpan = Duration.ofDays(30)
            it.uptimePercentage = calculateUptimePercentage(latestStatus.component, it.timeSpan, environmentId, now)
        }
    }

    private fun calculateUptimePercentage(component: ComponentType, timeSpan: Duration, environmentId: String, now: OffsetDateTime): Double {
        val limit = now.minus(timeSpan)
        var statusHistoryAsc = componentStatusService.getStatusHistoryAscSince(component, limit, environmentId)
        // If no status was found before the limit, the first record in the history is used as base for the calculation
        var initialRecord = componentStatusService.getFirstRecordBefore(component, limit, environmentId) ?: statusHistoryAsc.first()

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
                totalUptimeDuration += Duration.between(tmpLastUpStatus!!.timeStamp.toInstant(), componentRecord.timeStamp.toInstant()).abs()
            }
        }

        // Add time if last status is "UP"
        val lastRecord = statusHistoryAsc.lastOrNull() ?: tmpLastUpStatus
        if (lastRecord!!.status == ComponentOnlineStatus.UP) {
            totalUptimeDuration += Duration.between(lastRecord!!.timeStamp.toInstant(), now.toInstant()).abs()
        }

        // Subtract potential uptime before the limit
        if (initialRecord.status == ComponentOnlineStatus.UP && initialRecord.timeStamp.isBefore(limit)) {
            totalUptimeDuration -= Duration.between(initialRecord.timeStamp.toInstant(), limit.toInstant()).abs()
        }

        // Calculate uptime percentage
        val totalDuration = Duration.between(initialRecord.timeStamp.toInstant(), now.toInstant()).coerceAtMost(timeSpan).abs()
        val uptimePercentage = totalUptimeDuration.toMillis().toDouble() / totalDuration.toMillis().toDouble() * 100

        // Round value to two decimal places
        val symbols = DecimalFormatSymbols(Locale.US)
        val formatter = DecimalFormat("#.##", symbols)
        return formatter.format(uptimePercentage).toDouble()
    }

    private fun countConnectorStatuses(connectorMetadata: List<AuthorityPortalConnectorInfo>): ConnectorStatusCount {
        val onlineCount = connectorMetadata.count { it.onlineStatus == ONLINE }
        val disturbedCount = connectorMetadata.count {
            (it.onlineStatus == OFFLINE || it.onlineStatus == DEAD)
                && it.offlineSinceOrLastUpdatedAt != null
                && it.offlineSinceOrLastUpdatedAt!!.isAfter(OffsetDateTime.now().minusMinutes(2))
        }
        val offlineCount = connectorMetadata.count { it.onlineStatus == OFFLINE || it.onlineStatus == DEAD } - disturbedCount
        return ConnectorStatusCount(onlineCount, disturbedCount, offlineCount)
    }

    data class ConnectorStatusCount(
        val online: Int,
        val disturbed: Int,
        val offline: Int
    )
}