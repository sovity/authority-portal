/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

package de.sovity.authorityportal.web.environment

import de.sovity.authorityportal.api.model.DeploymentEnvironmentDto
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment.DapsConfig
import jakarta.enterprise.context.ApplicationScoped
import kotlin.jvm.optionals.getOrNull

@ApplicationScoped
class DeploymentEnvironmentDtoService(
    val deploymentEnvironmentService: DeploymentEnvironmentService
) {

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
            environmentId = envId,
            title = deploymentEnvironment.title(),
            dapsJwksUrl = buildDapsJwksUrl(deploymentEnvironment.daps()),
            dapsTokenUrl = buildDapsTokenUrl(deploymentEnvironment.daps()),
            loggingHouseUrl = deploymentEnvironment.loggingHouse().getOrNull()?.url()
        )
    }

    private fun buildDapsJwksUrl(daps: DapsConfig): String {
        return "${daps.url()}/realms/${daps.realmName()}/protocol/openid-connect/certs"
    }

    private fun buildDapsTokenUrl(daps: DapsConfig): String {
        return "${daps.url()}/realms/${daps.realmName()}/protocol/openid-connect/token"
    }
}
