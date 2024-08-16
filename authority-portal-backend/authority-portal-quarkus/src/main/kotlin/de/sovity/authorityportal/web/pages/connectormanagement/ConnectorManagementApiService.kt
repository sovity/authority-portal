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

package de.sovity.authorityportal.web.pages.connectormanagement

import de.sovity.authorityportal.api.model.ConnectorDetailDto
import de.sovity.authorityportal.api.model.ConnectorOverviewEntryDto
import de.sovity.authorityportal.api.model.ConnectorOverviewResult
import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.api.model.CreateConnectorWithJwksRequest
import de.sovity.authorityportal.api.model.CreateConnectorResponse
import de.sovity.authorityportal.api.model.DeploymentEnvironmentDto
import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.ProvidedConnectorOverviewEntryDto
import de.sovity.authorityportal.api.model.ProvidedConnectorOverviewResult
import de.sovity.authorityportal.api.model.ReserveConnectorRequest
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.db.jooq.tables.records.ConnectorRecord
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentDtoService
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.model.CreateConnectorParams
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.thirdparty.caas.CaasClient
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.utils.TimeUtils
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
import de.sovity.authorityportal.web.utils.idmanagement.DataspaceComponentIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import java.net.MalformedURLException
import java.net.URL

@ApplicationScoped
class ConnectorManagementApiService(
    val deploymentEnvironmentService: DeploymentEnvironmentService,
    val deploymentEnvironmentDtoService: DeploymentEnvironmentDtoService,
    val dataspaceComponentIdUtils: DataspaceComponentIdUtils,
    val clientIdUtils: ClientIdUtils,
    val connectorService: ConnectorService,
    val organizationService: OrganizationService,
    val dapsClientService: DapsClientService,
    val caasClient: CaasClient,
    val timeUtils: TimeUtils
) {

    fun ownOrganizationConnectorDetails(connectorId: String, organizationId: String, userId: String): ConnectorDetailDto =
        getConnectorDetails(connectorId, organizationId, userId)

    fun getConnectorDetails(connectorId: String, organizationId: String, userId: String): ConnectorDetailDto {
        val connector = connectorService.getConnectorDetailOrThrow(connectorId)

        if (!connectorId.contains(organizationId) && connector.hostOrganizationId != organizationId) {
            Log.error("Requested connector does not belong to the organization and is not hosted by it. connectorId=$connectorId, organizationId=$organizationId, userId=$userId.")
            error("Connector ID does not match with organization or host organization")
        }

        return buildConnectorDetailDto(connector)
    }

    fun getAuthorityConnectorDetails(connectorId: String): ConnectorDetailDto {
        val connector = connectorService.getConnectorDetailOrThrow(connectorId)
        return buildConnectorDetailDto(connector)
    }

    private fun buildConnectorDetailDto(connector: ConnectorService.ConnectorDetailRs): ConnectorDetailDto {
        return ConnectorDetailDto(
            connectorId = connector.connectorId,
            type = connector.type.toDto(),
            organizationName = connector.orgName,
            organizationId = connector.organizationId,
            hostOrganizationName = if (connector.type == ConnectorType.CAAS) "sovity GmbH" else connector.hostName,
            hostOrganizationId = connector.hostOrganizationId,
            environment = deploymentEnvironmentDtoService.findByIdOrThrow(connector.environment),
            connectorName = connector.connectorName,
            location = connector.location,
            frontendUrl = connector.frontendUrl,
            endpointUrl = connector.endpointUrl,
            managementUrl = connector.managementUrl,
            status = buildConnectorStatusFromConnectorDetails(connector)
        )
    }

    fun listOrganizationConnectors(organizationId: String, environmentId: String): ConnectorOverviewResult {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val connectors = connectorService.getConnectorsByOrganizationIdAndEnvironment(organizationId, environmentId)
        return buildConnectorOverview(connectors)
    }

    fun listAllConnectors(environmentId: String): ConnectorOverviewResult {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val connectors = connectorService.getConnectorsByEnvironment(environmentId)
        return buildConnectorOverview(connectors)
    }

    private fun buildConnectorOverview(connectors: List<ConnectorRecord>): ConnectorOverviewResult {
        val orgNames = organizationService.getAllOrganizationNames()

        val connectorDtos = connectors.map {
            ConnectorOverviewEntryDto(
                id = it.connectorId,
                hostName = if (it.type == ConnectorType.CAAS) "sovity GmbH" else orgNames[it.providerOrganizationId] ?: "",
                type = it.type.toDto(),
                environment = deploymentEnvironmentDtoService.findByIdOrThrow(it.environment),
                name = it.name,
                status = if (it.type == ConnectorType.CAAS) it.caasStatus.toDto() else it.onlineStatus.toDto(),
                frontendUrl = it.frontendUrl
            )
        }
        return ConnectorOverviewResult(connectorDtos)
    }

    fun listServiceProvidedConnectors(organizationId: String, environmentId: String): ProvidedConnectorOverviewResult {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val connectors = connectorService.getConnectorsByHostOrganizationId(organizationId, environmentId)
            .filter { it.organizationId != it.providerOrganizationId }
        val orgNames = organizationService.getAllOrganizationNames()

        val connectorDtos = connectors.map {
            ProvidedConnectorOverviewEntryDto(
                id = it.connectorId,
                customerOrgName = orgNames[it.organizationId] ?: "",
                type = it.type.toDto(),
                environment = deploymentEnvironmentDtoService.findByIdOrThrow(it.environment),
                name = it.name,
                status = buildConnectorStatusFromConnectorRecord(it),
                frontendUrl = it.frontendUrl
            )
        }

        return ProvidedConnectorOverviewResult(connectorDtos)
    }

    fun createOwnConnector(
        connector: CreateConnectorRequest,
        organizationId: String,
        userId: String,
        deploymentEnvId: String = "test"
    ): CreateConnectorResponse {
        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        val createConnectorParams = CreateConnectorParams(
            name = connector.name,
            location = connector.location,
            frontendUrl = removeUrlTrailingSlash(connector.frontendUrl),
            endpointUrl = removeUrlTrailingSlash(connector.endpointUrl),
            managementUrl = removeUrlTrailingSlash(connector.managementUrl),
            certificate = connector.certificate,
            jwksUrl = null
        )

        validateUrlConfiguration(createConnectorParams)?.let { return it }

        val connectorId = dataspaceComponentIdUtils.generateDataspaceComponentId(organizationId)
        val clientId = clientIdUtils.generateFromCertificate(createConnectorParams.certificate!!)

        if (clientIdUtils.exists(clientId)) {
            Log.error("Connector with this certificate already exists. connectorId=$connectorId, organizationId=$organizationId, userId=$userId, clientId=$clientId.")
            return CreateConnectorResponse.error("Connector with this certificate already exists.", timeUtils.now())
        }

        connectorService.createOwnConnector(
            connectorId = connectorId,
            organizationId = organizationId,
            environment = deploymentEnvId,
            clientId = clientId,
            createConnectorParams = createConnectorParams,
            createdBy = userId
        )
        registerConnectorAtDaps(clientId, connectorId, createConnectorParams, deploymentEnvId)

        Log.info("Connector for own organization registered. connectorId=$connectorId, organizationId=$organizationId, userId=$userId.")
        return CreateConnectorResponse.ok(connectorId, clientId, timeUtils.now())
    }

    fun reserveProvidedConnector(
        providerOrganizationId: String,
        userId: String,
        deploymentEnvId: String,
        connector: ReserveConnectorRequest
    ): IdResponse {
        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        val connectorParams = CreateConnectorParams(
            name = connector.name,
            location = connector.location,
            frontendUrl = null,
            endpointUrl = null,
            managementUrl = null,
            certificate = null,
            jwksUrl = null
        )

        val connectorId = dataspaceComponentIdUtils.generateDataspaceComponentId(providerOrganizationId)
        val clientId = clientIdUtils.generateFromConnectorId(connectorId)

        return connectorService.reserveProvidedConnector(
            connectorId = connectorId,
            clientId = clientId,
            organizationId = connector.customerOrganizationId,
            providerOrganizationId = providerOrganizationId,
            creationParams = connectorParams,
            environment = deploymentEnvId,
            createdBy = userId
        )
    }

    fun createProvidedConnectorWithCertificate(
        connector: CreateConnectorRequest,
        customerOrganizationId: String,
        providerOrganizationId: String,
        userId: String,
        deploymentEnvId: String
    ): CreateConnectorResponse {
        val connectorData = CreateConnectorParams(
            name = connector.name,
            location = connector.location,
            frontendUrl = removeUrlTrailingSlash(connector.frontendUrl),
            endpointUrl = removeUrlTrailingSlash(connector.endpointUrl),
            managementUrl = removeUrlTrailingSlash(connector.managementUrl),
            certificate = connector.certificate,
            jwksUrl = null
        )
        return createProvidedConnector(connectorData, customerOrganizationId, providerOrganizationId, userId, deploymentEnvId)
    }

    fun createProvidedConnectorWithJwks(
        connector: CreateConnectorWithJwksRequest,
        customerOrganizationId: String,
        providerOrganizationId: String,
        userId: String,
        deploymentEnvId: String
    ): CreateConnectorResponse {
        val connectorData = CreateConnectorParams(
            name = connector.name,
            location = connector.location,
            frontendUrl = removeUrlTrailingSlash(connector.frontendUrl),
            endpointUrl = removeUrlTrailingSlash(connector.endpointUrl),
            managementUrl = removeUrlTrailingSlash(connector.managementUrl),
            certificate = null,
            jwksUrl = connector.jwksUrl
        )
        return createProvidedConnector(connectorData, customerOrganizationId, providerOrganizationId, userId, deploymentEnvId)
    }

    private fun createProvidedConnector(
        connector: CreateConnectorParams,
        customerOrganizationId: String,
        providerOrganizationId: String,
        userId: String,
        deploymentEnvId: String = "test"
    ): CreateConnectorResponse {
        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        if (!isValidUrlConfiguration(connector.frontendUrl, connector.endpointUrl, connector.managementUrl)) {
            Log.error("Connector URL is not valid. url=${connector.frontendUrl}, userId=$userId, customerOrganizationId=$customerOrganizationId.")
            return CreateConnectorResponse.error("Connector URL is not valid.", timeUtils.now())
        }

        val connectorId = dataspaceComponentIdUtils.generateDataspaceComponentId(customerOrganizationId)
        val clientId = when (connector.certificate) {
            null -> clientIdUtils.generateFromConnectorId(connectorId)
            else -> clientIdUtils.generateFromCertificate(connector.certificate)
        }

        if (clientIdUtils.exists(clientId)) {
            Log.error("Connector with this client ID already exists. connectorId=$connectorId, customerOrganizationId=$customerOrganizationId, userId=$userId, clientId=$clientId.")
            return CreateConnectorResponse.error("Connector with this client ID already exists.", timeUtils.now())
        }

        connectorService.createProvidedConnector(
            connectorId = connectorId,
            organizationId = customerOrganizationId,
            providerOrganizationId = providerOrganizationId,
            environment = deploymentEnvId,
            clientId = clientId,
            createConnectorParams = connector,
            createdBy = userId
        )
        registerConnectorAtDaps(clientId, connectorId, connector, deploymentEnvId)

        Log.info("Connector for foreign organization registered. connectorId=$connectorId, customerOrganizationId=$customerOrganizationId, userId=$userId.")
        return CreateConnectorResponse.ok(connectorId, clientId, timeUtils.now())
    }

    private fun isValidUrlConfiguration(
        frontendUrlString: String?,
        endpointUrlString: String?,
        managementUrlString: String?
    ): Boolean {
        if (frontendUrlString == null || endpointUrlString == null || managementUrlString == null) {
            return false
        }

        try {
            val frontendUrl = URL(frontendUrlString)
            val endpointUrl = URL(endpointUrlString)
            val managementUrl = URL(managementUrlString)
            return (frontendUrl.protocol == "https"
                && endpointUrl.protocol == "https"
                && managementUrl.protocol == "https")
        } catch (e: MalformedURLException) {
            return false
        }
    }

    private fun removeUrlTrailingSlash(url: String): String {
        return url.trim().removeSuffix("/")
    }

    fun deleteOwnOrProvidedConnector(
        connectorId: String,
        organizationId: String,
        userId: String
    ): IdResponse {
        val connector = connectorService.getConnectorOrThrow(connectorId)

        if (!connectorId.startsWith(organizationId) && connector.providerOrganizationId != organizationId) {
            Log.error("To be deleted connector does not belong to user's organization and is not hosted by it. connectorId=$connectorId, organizationId=$organizationId, userId=$userId.")
            error("Connector ID does not match the ID of the user's organization or host organization")
        }

        deleteConnector(connector)
        Log.info("Connector unregistered. connectorId=$connectorId, organizationId=$organizationId, userId=$userId.")

        return IdResponse(connectorId, timeUtils.now())
    }

    fun deleteAllOrganizationConnectors(organizationid: String) {
        val connectors = connectorService.getConnectorsByOrganizationId(organizationid)
        connectors.forEach { deleteConnector(it) }
    }

    private fun deleteConnector(connector: ConnectorRecord) {
        val deploymentEnvId = connector.environment

        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        if (connector.type == ConnectorType.CAAS) {
            caasClient.deleteCaas(listOf(connector.connectorId))
        }

        dapsClientService.forEnvironment(deploymentEnvId).deleteClient(connector.clientId)
        connectorService.deleteConnectorFromDb(connector.connectorId)
    }

    fun getAllDeploymentEnvironment(): List<DeploymentEnvironmentDto> {
        return deploymentEnvironmentDtoService.findAll()
    }

    private fun registerConnectorAtDaps(
        clientId: String,
        connectorId: String,
        connector: CreateConnectorParams,
        deploymentEnvId: String
    ) {
        val dapsClient = dapsClientService.forEnvironment(deploymentEnvId)
        dapsClient.createClient(clientId)

        if (!connector.certificate.isNullOrEmpty()) {
            dapsClient.addCertificate(clientId, connector.certificate)
            dapsClient.configureMappers(clientId, connectorId, connector.certificate)
        } else if (!connector.jwksUrl.isNullOrEmpty()) {
            dapsClient.addJwksUrl(clientId, connector.jwksUrl)
            dapsClient.configureMappers(clientId, connectorId)
        } else {
            error("Either certificate or JWKS URL must be provided, connectorId=$connectorId, clientId=$clientId.")
        }
    }

    private fun buildConnectorStatusFromConnectorDetails(connector: ConnectorService.ConnectorDetailRs) =
        if (connector.type == ConnectorType.CAAS) {
            connector.caasStatus!!.toDto()
        } else {
            filterDeadConnectorStatus(connector.onlineStatus!!).toDto()
        }

    private fun buildConnectorStatusFromConnectorRecord(it: ConnectorRecord) =
        if (it.type == ConnectorType.CAAS) {
            it.caasStatus.toDto()
        } else {
            filterDeadConnectorStatus(it.onlineStatus).toDto()
        }

    private fun validateUrlConfiguration(connectorData: CreateConnectorParams): CreateConnectorResponse? {
        if (isValidUrlConfiguration(connectorData.frontendUrl, connectorData.endpointUrl, connectorData.managementUrl)) return null
        else {
            Log.error("Connector URL is not valid. frontendUrl=${connectorData.frontendUrl}, endpointUrl=${connectorData.endpointUrl}, managementUrl=${connectorData.managementUrl}.")
            return CreateConnectorResponse.error("Connector URL is not valid.", timeUtils.now())
        }
    }

    private fun filterDeadConnectorStatus(status: ConnectorOnlineStatus) =
        if (status == ConnectorOnlineStatus.DEAD) {
            ConnectorOnlineStatus.OFFLINE
        } else {
            status
        }
}
