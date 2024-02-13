package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.db.jooq.enums.ConnectorBrokerRegistrationStatus
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.ConnectorService.UnregisteredBrokerConnector
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional

@ApplicationScoped
class BrokerSyncService {

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var brokerClientService: BrokerClientService

    @Transactional
    @Scheduled(every = "15m")
    fun repeatFailedRegistrations() {
        // Connectors
        val failedRegistrations = connectorService.getUnregisteredBrokerConnectors().groupBy { it.environmentId }
        failedRegistrations.forEach {
            registerConnectors(it.key, it.value)
        }
    }

    private fun registerConnectors(envId: String, connectors: List<UnregisteredBrokerConnector>) {
        try {
            val connectorUrls = connectors.map { it.connectorEndpointUrl }
            val connectorIds = connectors.map { it.connectorId }
            brokerClientService.forEnvironment(envId).addConnectors(connectorUrls)
            connectorService.setConnectorBrokerRegistrationStatus(connectorIds, ConnectorBrokerRegistrationStatus.REGISTERED)
        } catch (e: Exception) {
            Log.error("Failed to re-register connectors in broker. envId=$envId", e)
        }
    }
}
