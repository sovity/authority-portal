package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
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

    private val connectorMetadataByEnvironment = mutableMapOf<String, List<AuthorityPortalConnectorInfo>>()

    @Scheduled(every="5m")
    fun fetchConnectorMetadata() {
        val environments = deploymentEnvironmentService.findAll().keys

        environments.forEach { env ->
            val connectorMetadata = fetchDataOfferCountsByEnvironment(env)
            connectorMetadataByEnvironment[env] = connectorMetadata
        }

        Log.info("Connector metadata fetched. environmentIds=$environments.")
    }

    fun getTotalDataOffersByMdsId(mdsId: String, environmentId: String): Int {
        val connectorEndpoints = connectorService.getConnectorsByMdsId(mdsId, environmentId).map { it.url }
        val organizationConnectorMetadata = connectorMetadataByEnvironment[environmentId]?.filter { connectorEndpoints.contains(it.connectorEndpoint) } ?: emptyList()
        return organizationConnectorMetadata.sumOf { it.dataOfferCount }
    }

    private fun fetchDataOfferCountsByEnvironment(environmentId: String): List<AuthorityPortalConnectorInfo> {
        val connectorEndpoints = connectorService.getConnectorsByEnvironment(environmentId).map { it.url }
        return brokerClientService.forEnvironment(environmentId).getConnectorMetadata(connectorEndpoints)
    }
}
