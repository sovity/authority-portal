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

    fun findAll(): Map<String, DeploymentEnvironment> = deploymentEnvironmentConfiguration.environments()

    fun findByIdOrThrow(envId: String): DeploymentEnvironment =
        deploymentEnvironmentConfiguration.environments()[envId] ?: error("Environment $envId not found")

    fun assertValidEnvId(envId: String) {
        findByIdOrThrow(envId)
    }
}
