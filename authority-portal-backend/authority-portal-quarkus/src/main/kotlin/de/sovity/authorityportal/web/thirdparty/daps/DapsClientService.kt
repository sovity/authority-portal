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

package de.sovity.authorityportal.web.thirdparty.daps

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
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
