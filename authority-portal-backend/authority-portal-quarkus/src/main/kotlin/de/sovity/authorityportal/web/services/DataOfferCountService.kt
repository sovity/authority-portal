package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import lombok.Getter

@ApplicationScoped
class DataOfferCountService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var brokerClientService: BrokerClientService

    @Inject
    lateinit var connectorService: ConnectorService

    private val dataOfferCountsByEnvironment = mutableMapOf<String, Map<String, Int>>()

    @Scheduled(every="5m")
    fun fetchDataOfferCounts() {
        val environments = deploymentEnvironmentService.findAll().keys

        environments.forEach { env ->
            val dataOfferCounts = fetchDataOfferCountsByEnvironment(env)
            dataOfferCountsByEnvironment[env] = dataOfferCounts
        }

        Log.info("Data offer counts fetched. environmentIds=$environments.")
    }

    fun getTotalDataOffersByMdsId(mdsId: String, environmentId: String): Int {
        val connectorEndpoints = connectorService.getConnectorsByMdsId(mdsId, environmentId).map { it.url }
        val organizationDataOffers = dataOfferCountsByEnvironment[environmentId]?.filter { connectorEndpoints.contains(it.key) } ?: emptyMap()
        return organizationDataOffers.values.sum()
    }

    private fun fetchDataOfferCountsByEnvironment(environmentId: String): Map<String, Int> {
        val connectorEndpoints = connectorService.getConnectorsByEnvironment(environmentId).map { it.url }
        return brokerClientService.forEnvironment(environmentId).getDataOfferCounts(connectorEndpoints)
    }
}
