package de.sovity.authorityportal.web.pages.connectormanagement

import de.sovity.authorityportal.api.model.ConnectorDetailDto
import de.sovity.authorityportal.api.model.ConnectorOverviewEntryDto
import de.sovity.authorityportal.api.model.ConnectorOverviewResult
import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.api.model.DeploymentEnvironmentDto
import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentDtoService
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
import de.sovity.authorityportal.web.utils.idmanagement.ConnectorIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class ConnectorManagementApiService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var deploymentEnvironmentDtoService: DeploymentEnvironmentDtoService

    @Inject
    lateinit var connectorIdUtils: ConnectorIdUtils

    @Inject
    lateinit var clientIdUtils: ClientIdUtils

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var dapsClientService: DapsClientService

    @Inject
    lateinit var brokerClientService: BrokerClientService

    fun ownOrganizationConnectorDetails(connectorId: String, mdsId: String, userId: String): ConnectorDetailDto =
        getConnectorDetails(connectorId, mdsId, userId)

    fun getConnectorDetails(connectorId: String, mdsId: String, userId: String): ConnectorDetailDto {
        if (!connectorId.contains(mdsId)) {
            Log.error("Requested connector does not belong to the organization. connectorId=$connectorId, mdsId=$mdsId, userId=$userId.")
            error("Connector ID does not match with organization")
        }

        val connector = connectorService.getConnectorDetailOrThrow(connectorId)

        return ConnectorDetailDto(
            connector.connectorId,
            connector.type.toDto(),
            connector.orgName,
            connector.orgMdsId,
            connector.hostName,
            connector.hostMdsId,
            deploymentEnvironmentDtoService.findByIdOrThrow(connector.environment),
            connector.connectorName,
            connector.location,
            connector.url
        )
    }

    fun listOrganizationConnectors(mdsId: String, environmentId: String): ConnectorOverviewResult {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val connectors = connectorService.getConnectorsByMdsId(mdsId, environmentId)

        val connectorDtos = connectors.map {
            ConnectorOverviewEntryDto(
                it.connectorId,
                organizationService.getOrganizationOrThrow(it.providerMdsId).name,
                it.type.toDto(),
                deploymentEnvironmentDtoService.findByIdOrThrow(it.environment),
                it.name
            )
        }

        return ConnectorOverviewResult(connectorDtos)
    }

    fun createOwnConnector(
        connector: CreateConnectorRequest,
        mdsId: String,
        userId: String,
        deploymentEnvId: String = "test"
    ): IdResponse {
        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        val connectorId = connectorIdUtils.generateConnectorId(mdsId)
        val clientId = clientIdUtils.generateClientId(connector.certificate)

        connectorService.createOwnConnector(
            connectorId = connectorId,
            mdsId = mdsId,
            environment = deploymentEnvId,
            clientId = clientId,
            connector = connector,
            createdBy =  userId
        )
        registerConnectorAtDaps(clientId, connectorId, connector, deploymentEnvId)
        brokerClientService.forEnvironment(deploymentEnvId).addConnector(connector.url)

        Log.info("Connector for own organization registered. connectorId=$connectorId, mdsId=$mdsId, userId=$userId.")

        return IdResponse(connectorId)
    }

    fun createProvidedConnector(
        connector: CreateConnectorRequest,
        customerMdsId: String,
        providerMdsId: String,
        userId: String,
        deploymentEnvId: String = "test"
    ): IdResponse {
        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        val connectorId = connectorIdUtils.generateConnectorId(customerMdsId)
        val clientId = clientIdUtils.generateClientId(connector.certificate)

        connectorService.createProvidedConnector(
            connectorId = connectorId,
            mdsId = customerMdsId,
            providerMdsId = providerMdsId,
            environment = deploymentEnvId,
            clientId = clientId,
            connector = connector,
            createdBy = userId
        )
        registerConnectorAtDaps(clientId, connectorId, connector, deploymentEnvId)
        brokerClientService.forEnvironment(deploymentEnvId).addConnector(connector.url)

        Log.info("Connector for foreign organization registered. connectorId=$connectorId, customerMdsId=$customerMdsId, userId=$userId.")

        return IdResponse(connectorId)
    }

    fun deleteOwnConnector(
        connectorId: String,
        mdsId: String,
        userId: String
    ): IdResponse {
        if (!connectorId.startsWith(mdsId)) {
            Log.error("To be deleted connector does not belong to user's organization. connectorId=$connectorId, mdsId=$mdsId, userId=$userId.")
            error("Connector ID does not match MDS-ID of the user's organization")
        }

        val connector = connectorService.getConnectorOrThrow(connectorId)
        val deploymentEnvId = connector.environment

        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        connectorService.deleteConnector(connectorId)
        dapsClientService.forEnvironment(deploymentEnvId).deleteClient(connector.clientId)
        brokerClientService.forEnvironment(deploymentEnvId).removeConnector(connector.url)

        Log.info("Connector unregistered. connectorId=$connectorId, mdsId=$mdsId, userId=$userId.")

        return IdResponse(connectorId)
    }

    fun getAllDeploymentEnvironment(): List<DeploymentEnvironmentDto> {
        return deploymentEnvironmentDtoService.findAll()
    }

    private fun registerConnectorAtDaps(
        clientId: String,
        connectorId: String,
        connector: CreateConnectorRequest,
        deploymentEnvId: String
    ) {
        val dapsClient = dapsClientService.forEnvironment(deploymentEnvId)
        dapsClient.createClient(clientId)
        dapsClient.addCertificate(clientId, connector.certificate)
        dapsClient.configureMappers(clientId, connectorId, connector)
    }
}
