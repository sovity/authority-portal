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

package de.sovity.authorityportal.web.pages.centralcomponentmanagement

import de.sovity.authorityportal.api.model.CentralComponentCreateRequest
import de.sovity.authorityportal.api.model.CentralComponentDto
import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.db.jooq.tables.records.ComponentRecord
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.CentralComponentService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
import de.sovity.authorityportal.web.utils.idmanagement.DataspaceComponentIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class CentralComponentManagementApiService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var centralComponentService: CentralComponentService

    @Inject
    lateinit var dataspaceComponentIdUtils: DataspaceComponentIdUtils

    @Inject
    lateinit var clientIdUtils: ClientIdUtils

    @Inject
    lateinit var dapsClientService: DapsClientService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var organizationService: OrganizationService

    fun listCentralComponents(envId: String): List<CentralComponentDto> {
        deploymentEnvironmentService.assertValidEnvId(envId)
        val centralComponents = centralComponentService.getCentralComponentsByEnvironment(envId)

        return centralComponents.map { centralComponent ->
            val createdBy = userService.getUserOrThrow(centralComponent.createdBy)
            val organization = organizationService.getOrganizationOrThrow(centralComponent.mdsId)

            CentralComponentDto().also {
                it.centralComponentId = centralComponent.id
                it.name = centralComponent.name
                it.homepageUrl = centralComponent.homepageUrl
                it.endpointUrl = centralComponent.endpointUrl
                it.createdByUserFullName = createdBy.firstName + " " + createdBy.lastName
                it.createdByOrgName = organization.name
                it.createdByOrgMdsId = organization.mdsId
            }
        }
    }

    fun registerCentralComponent(
        centralComponentCreateRequest: CentralComponentCreateRequest,
        userId: String,
        mdsId: String,
        envId: String
    ): IdResponse {
        deploymentEnvironmentService.assertValidEnvId(envId)

        val centralComponentId = dataspaceComponentIdUtils.generateDataspaceComponentId(mdsId)
        val clientId = clientIdUtils.generateFromCertificate(centralComponentCreateRequest.certificate)

        if (clientIdUtils.exists(clientId)) {
            Log.error("Component with this certificate already exists. connectorId=$centralComponentId, mdsId=$mdsId, userId=$userId, clientId=$clientId.")
            error("Component with this certificate already exists")
        }

        centralComponentService.createCentralComponent(
            centralComponentId = centralComponentId,
            mdsId = mdsId,
            environment = envId,
            clientId = clientId,
            centralComponentCreateRequest = centralComponentCreateRequest,
            createdBy = userId
        )

        val dapsClient = dapsClientService.forEnvironment(envId)
        dapsClient.createClient(clientId)
        dapsClient.addCertificate(clientId, centralComponentCreateRequest.certificate)
        dapsClient.configureMappers(clientId, centralComponentId, centralComponentCreateRequest.certificate)

        Log.info("Central component registered. centralComponentId=$centralComponentId, mdsId=$mdsId, userId=$userId, clientId=$clientId.")
        return IdResponse(centralComponentId)
    }

    fun deleteCentralComponentByUser(centralComponentId: String, userId: String): IdResponse {
        val centralComponent = centralComponentService.getCentralComponentOrThrow(centralComponentId)

        deleteCentralComponent(centralComponent)
        Log.info("Central component deleted. centralComponentId=$centralComponentId, mdsId=${centralComponent.mdsId}, userId=$userId, clientId=${centralComponent.clientId}.")

        return IdResponse(centralComponentId)
    }

    fun deleteAllOrganizationCentralComponents(mdsId: String) {
        val components = centralComponentService.getCentralComponentsByMdsId(mdsId)
        components.forEach { deleteCentralComponent(it) }
    }

    private fun deleteCentralComponent(centralComponent: ComponentRecord) {
        centralComponentService.deleteCentralComponent(centralComponent.id)

        val dapsClient = dapsClientService.forEnvironment(centralComponent.environment)
        dapsClient.deleteClient(centralComponent.clientId)
    }
}
