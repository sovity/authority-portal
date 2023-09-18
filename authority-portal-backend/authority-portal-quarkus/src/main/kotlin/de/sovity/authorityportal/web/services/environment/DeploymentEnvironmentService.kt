package de.sovity.authorityportal.web.services.environment

import de.sovity.authorityportal.web.services.environment.ConnectorDeploymentConfiguration.ConnectorDeploymentEnvironment
import io.quarkus.runtime.StartupEvent
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.event.Observes
import jakarta.inject.Inject

@ApplicationScoped
class DeploymentEnvironmentService {

    @Inject
    lateinit var connectorDeploymentConfiguration: ConnectorDeploymentConfiguration

    fun onStartUp(@Observes event: StartupEvent) {
        // TODO: validate all found deployment environments
        assertValidEnvId("test")
    }

    fun findByIdOrThrow(envId: String): ConnectorDeploymentEnvironment =
        connectorDeploymentConfiguration.environments()[envId] ?: error("Environment $envId not found")

    fun assertValidEnvId(envId: String) {
        findByIdOrThrow(envId)
    }
}
