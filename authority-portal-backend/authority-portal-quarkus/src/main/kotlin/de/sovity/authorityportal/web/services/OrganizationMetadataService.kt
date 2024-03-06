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
package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalOrganizationMetadata
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationMetadataService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var brokerClientService: BrokerClientService

    @Inject
    lateinit var organizationService: OrganizationService

    @Scheduled(every = "1m")
    fun pushOrganizationMetadataToBroker() {
        val environments = deploymentEnvironmentService.findAll().keys
        val orgMetadata = organizationService.getOrganizations().map {
            AuthorityPortalOrganizationMetadata().apply {
                mdsId = it.mdsId
                name = it.name
            }
        }

        environments.forEach { environmentId -> tryPushMetadataForEnvironment(environmentId, orgMetadata) }
    }

    private fun tryPushMetadataForEnvironment(environmentId: String, orgMetadata: List<AuthorityPortalOrganizationMetadata>) {
        try {
            brokerClientService.forEnvironment(environmentId).setOrganizationMetadata(orgMetadata)
            Log.info("Organization metadata successfully synced to Broker. environmentId=$environmentId.")
        } catch (e: Exception) {
            Log.error("Failed to sync organization metadata to Broker. Trying again later. environmentId=$environmentId.", e)
        }
    }
}
