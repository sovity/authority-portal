package de.sovity.authorityportal.web.services.thirdparty.broker

import de.sovity.authorityportal.web.services.environment.DeploymentEnvironmentService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.util.concurrent.ConcurrentHashMap

@ApplicationScoped
class BrokerClientService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    private val clients = ConcurrentHashMap<String, BrokerClient>()

    fun forEnvironment(envId: String): BrokerClient = clients.getOrPut(envId) {
        val deploymentEnvironment = deploymentEnvironmentService.findByIdOrThrow(envId)
        BrokerClient(deploymentEnvironment.broker())
    }
}
