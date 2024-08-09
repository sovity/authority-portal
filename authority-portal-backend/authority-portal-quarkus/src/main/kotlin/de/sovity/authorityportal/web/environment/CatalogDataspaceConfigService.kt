/*
 *  Copyright (c) 2023 sovity GmbH
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  SPDX-License-Identifier: Apache-2.0
 *
 *  Contributors:
 *       sovity GmbH - initial API and implementation
 *
 */
package de.sovity.authorityportal.web.environment

import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class CatalogDataspaceConfigService(
    val deploymentEnvironmentService: DeploymentEnvironmentService
) {

    val hasMultipleDataspaces: Boolean by lazy {
        deploymentEnvironmentService.findAll().values
            .any { it.dataCatalog().dataspaceNames().connectorIds().isNotEmpty() }
    }

    fun forEnvironment(envId: String): CatalogDataspaceConfig {
        val env = deploymentEnvironmentService.findByIdOrThrow(envId)
        return CatalogDataspaceConfig(
            namesByConnectorId = env.dataCatalog().dataspaceNames().connectorIds(),
            defaultName = env.dataCatalog().dataspaceNames().default()
        )
    }
}
