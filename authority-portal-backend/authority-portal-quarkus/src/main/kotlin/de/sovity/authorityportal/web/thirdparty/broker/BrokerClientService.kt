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
package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
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
