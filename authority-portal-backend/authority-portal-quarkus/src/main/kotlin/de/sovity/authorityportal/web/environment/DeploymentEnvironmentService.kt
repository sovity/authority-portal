package de.sovity.authorityportal.web.environment

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment
import io.quarkus.runtime.StartupEvent
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.event.Observes
import jakarta.inject.Inject

@ApplicationScoped
class DeploymentEnvironmentService {

    @Inject
    lateinit var deploymentEnvironmentConfiguration: DeploymentEnvironmentConfiguration

    fun onStartUp(@Observes event: StartupEvent) {
        // TODO: validate all found deployment environments
        assertValidEnvId("test")
    }

    fun findAll() = deploymentEnvironmentConfiguration.environments()

    fun findByIdOrThrow(envId: String): DeploymentEnvironment =
        deploymentEnvironmentConfiguration.environments()[envId] ?: error("Environment $envId not found")

    fun assertValidEnvId(envId: String) {
        findByIdOrThrow(envId)
    }
}
