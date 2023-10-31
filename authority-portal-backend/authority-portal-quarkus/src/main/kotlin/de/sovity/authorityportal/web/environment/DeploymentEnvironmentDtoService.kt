package de.sovity.authorityportal.web.environment

import de.sovity.authorityportal.api.model.DeploymentEnvironmentDto
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class DeploymentEnvironmentDtoService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    fun findByIdOrThrow(envId: String): DeploymentEnvironmentDto =
        buildDto(envId, deploymentEnvironmentService.findByIdOrThrow(envId))

    fun findAll(): List<DeploymentEnvironmentDto> =
        deploymentEnvironmentService.findAll()
            .map { it.value.position() to buildDto(it.key, it.value) }
            .sortedBy { it.first }
            .map { it.second }
            .toList()

    private fun buildDto(envId: String, deploymentEnvironment: DeploymentEnvironment): DeploymentEnvironmentDto {
        return DeploymentEnvironmentDto(
            envId,
            deploymentEnvironment.title()
        )
    }
}
