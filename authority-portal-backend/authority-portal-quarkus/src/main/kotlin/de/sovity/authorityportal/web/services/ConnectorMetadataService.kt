package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.tables.records.ConnectorDowntimesRecord
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.pages.connectormanagement.toDb
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.time.OffsetDateTime

@ApplicationScoped
class ConnectorMetadataService {

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var brokerClientService: BrokerClientService

    @Inject
    lateinit var connectorService: ConnectorService

    private val byEnvironment = mutableMapOf<String, BrokerData>()

    @Scheduled(every = "30s")
    fun fetchConnectorMetadata() {
        val environments = deploymentEnvironmentService.findAll().keys

        environments.forEach { env ->
            updateByEnvironment(env)
            addConnectorStatusesToDbIfChanged(env)
        }
    }

    fun getConnectorInfoByEnvironment(environmentId: String): List<AuthorityPortalConnectorInfo> =
        getByEnvironment(environmentId).connectorInfos

    fun getConnectorInfoByMdsId(mdsId: String, environmentId: String): List<AuthorityPortalConnectorInfo> =
        getByEnvironment(environmentId).getByMdsId(mdsId)

    fun getTotalDataOffersByMdsId(mdsId: String, environmentId: String): Int =
        getByEnvironment(environmentId).getByMdsId(mdsId).sumOf { it.dataOfferCount }

    fun getConnectorStatus(connectorId: String, environmentId: String): ConnectorOnlineStatus =
        getByEnvironment(environmentId).getByConnectorId(connectorId).onlineStatus ?: ConnectorOnlineStatus.DEAD

    fun getLatestConnectorStatusesFromDb(environment: String): List<ConnectorDowntimesRecord> {
        val c = Tables.CONNECTOR_DOWNTIMES

        return dsl.selectFrom(c)
            .where(c.ENVIRONMENT.eq(environment))
            .fetch()
    }

    private fun updateByEnvironment(environmentId: String) {
        try {
            val endpointUrls = connectorService.getConnectorsByEnvironment(environmentId).map { it.endpointUrl}
            val metadata = brokerClientService.forEnvironment(environmentId).getConnectorMetadata(endpointUrls)
            byEnvironment[environmentId] = BrokerData(metadata)
            Log.info("Connector metadata fetched. environmentId=$environmentId.")
        } catch (e: Exception) {
            Log.warn("Failed to fetch connector metadata. environmentId=$environmentId.", e)
        }
    }

    private fun addConnectorStatusesToDbIfChanged(environment: String) {
        val latestStatuses = getLatestConnectorStatusesFromDb(environment)
        val connectorInfos = getByEnvironment(environment).connectorInfos

        connectorInfos.forEach() { connectorInfo ->
            val latestStatus = latestStatuses.firstOrNull { it.connectorId == connectorInfo.participantId }?.status
            val status = connectorInfo.onlineStatus?.toDb()

            if (status != null && latestStatus != status) {
                dsl.insertInto(Tables.CONNECTOR_DOWNTIMES)
                    .set(Tables.CONNECTOR_DOWNTIMES.CONNECTOR_ID, connectorInfo.participantId)
                    .set(Tables.CONNECTOR_DOWNTIMES.ENVIRONMENT, environment)
                    .set(Tables.CONNECTOR_DOWNTIMES.STATUS, status)
                    .set(Tables.CONNECTOR_DOWNTIMES.TIME_STAMP, OffsetDateTime.now())
                    .execute()

                Log.info("Connector status changed. connectorId=${connectorInfo.participantId}, environment=$environment, newStatus=$status, oldStatus=$latestStatus.")
            }
        }
    }

    private fun getByEnvironment(environmentId: String): BrokerData {
        return byEnvironment[environmentId] ?: BrokerData(emptyList())
    }

    class BrokerData(val connectorInfos: List<AuthorityPortalConnectorInfo>) {
        private val byConnectorId = connectorInfos.associateBy { it.participantId }
        private val byMdsId = connectorInfos.groupBy { getMdsId(it.participantId) }

        fun getByConnectorId(connectorId: String): AuthorityPortalConnectorInfo {
            return byConnectorId[connectorId] ?: notFound()
        }

        fun getByMdsId(mdsId: String): List<AuthorityPortalConnectorInfo> {
            return byMdsId[mdsId] ?: emptyList()
        }

        private fun notFound(): AuthorityPortalConnectorInfo {
            return AuthorityPortalConnectorInfo().apply {
                dataOfferCount = 0
                onlineStatus = ConnectorOnlineStatus.DEAD
                offlineSinceOrLastUpdatedAt = null
            }
        }

        private fun getMdsId(participantId: String): String {
            return participantId.split(".").first()
        }
    }
}
