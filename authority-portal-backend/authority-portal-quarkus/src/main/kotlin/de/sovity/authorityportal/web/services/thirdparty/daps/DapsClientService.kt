package de.sovity.authorityportal.web.services.thirdparty.daps

import de.sovity.authorityportal.web.services.environment.DeploymentEnvironmentService
import jakarta.annotation.PreDestroy
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.util.concurrent.ConcurrentHashMap

@ApplicationScoped
class DapsClientService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    private val clients = ConcurrentHashMap<String, DapsClient>()

    fun forEnvironment(envId: String): DapsClient = clients.getOrPut(envId) {
        val deploymentEnvironment = deploymentEnvironmentService.findByIdOrThrow(envId)
        DapsClient(deploymentEnvironment.daps())
    }

    @PreDestroy
    fun close() {
        clients.values.forEach { it.close() }
    }
}
