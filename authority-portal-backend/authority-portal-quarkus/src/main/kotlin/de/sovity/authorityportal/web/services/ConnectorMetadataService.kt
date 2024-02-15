package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class ConnectorMetadataService {

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
        }
    }

    fun getTotalDataOffersByMdsId(mdsId: String, environmentId: String): Int {
        return getByEnvironment(environmentId).getByMdsId(mdsId).sumOf { it.dataOfferCount }
    }

    fun getConnectorStatus(connectorId: String, environmentId: String): ConnectorOnlineStatus {
        return getByEnvironment(environmentId).getByConnectorId(connectorId).onlineStatus ?: ConnectorOnlineStatus.DEAD
    }

    private fun updateByEnvironment(environmentId: String) {
        try {
            val endpointUrls = connectorService.getConnectorsByEnvironment(environmentId).map { it.endpointUrl}
            val metadata = brokerClientService.forEnvironment(environmentId).getConnectorMetadata(endpointUrls)
            byEnvironment[environmentId] = BrokerData(metadata)
            Log.info("Connector metadata fetched for environmentId=$environmentId.")
        } catch (e: Exception) {
            Log.warn("Failed to fetch connector metadata for environmentId=$environmentId.", e)
        }
    }

    private fun getByEnvironment(environmentId: String): BrokerData {
        return byEnvironment[environmentId] ?: BrokerData(emptyList())
    }

    class BrokerData(connectorInfos: List<AuthorityPortalConnectorInfo>) {
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
