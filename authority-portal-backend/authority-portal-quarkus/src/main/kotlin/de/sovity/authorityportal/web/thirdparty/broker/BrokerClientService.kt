package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.utils.urlmanagement.ConnectorUrlUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.util.concurrent.ConcurrentHashMap

@ApplicationScoped
class BrokerClientService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var connectorUrlUtils: ConnectorUrlUtils

    private val clients = ConcurrentHashMap<String, BrokerClient>()

    fun forEnvironment(envId: String): BrokerClient = clients.getOrPut(envId) {
        val deploymentEnvironment = deploymentEnvironmentService.findByIdOrThrow(envId)
        BrokerClient(deploymentEnvironment.broker(), connectorUrlUtils)
    }
}
