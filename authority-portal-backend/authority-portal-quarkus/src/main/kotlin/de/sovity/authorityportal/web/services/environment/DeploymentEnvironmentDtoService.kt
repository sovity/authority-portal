package de.sovity.authorityportal.web.services.environment

import de.sovity.authorityportal.api.model.DeploymentEnvironmentDto
import de.sovity.authorityportal.web.services.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class DeploymentEnvironmentDtoService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    fun findByIdOrThrow(envId: String): DeploymentEnvironmentDto =
        buildDto(envId, deploymentEnvironmentService.findByIdOrThrow(envId))

    private fun buildDto(envId: String, deploymentEnvironment: DeploymentEnvironment): DeploymentEnvironmentDto {
        return DeploymentEnvironmentDto(
            envId,
            deploymentEnvironment.title()
        )
    }
}
