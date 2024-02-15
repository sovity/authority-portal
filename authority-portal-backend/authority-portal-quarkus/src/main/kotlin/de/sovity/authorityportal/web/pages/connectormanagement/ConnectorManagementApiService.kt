package de.sovity.authorityportal.web.pages.connectormanagement

import de.sovity.authorityportal.api.model.ConnectorDetailDto
import de.sovity.authorityportal.api.model.ConnectorOverviewEntryDto
import de.sovity.authorityportal.api.model.ConnectorOverviewResult
import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.api.model.CreateConnectorResponse
import de.sovity.authorityportal.api.model.DeploymentEnvironmentDto
import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.ProvidedConnectorOverviewEntryDto
import de.sovity.authorityportal.api.model.ProvidedConnectorOverviewResult
import de.sovity.authorityportal.api.model.organization.ConnectorStatusDto
import de.sovity.authorityportal.db.jooq.enums.ConnectorBrokerRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentDtoService
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorMetadataService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.caas.CaasClient
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
import de.sovity.authorityportal.web.utils.idmanagement.DataspaceComponentIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.net.MalformedURLException
import java.net.URL

@ApplicationScoped
class ConnectorManagementApiService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var deploymentEnvironmentDtoService: DeploymentEnvironmentDtoService

    @Inject
    lateinit var dataspaceComponentIdUtils: DataspaceComponentIdUtils

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

    @Inject
    lateinit var caasClient: CaasClient

    @Inject
    lateinit var connectorMetadataService: ConnectorMetadataService

    fun ownOrganizationConnectorDetails(connectorId: String, mdsId: String, userId: String): ConnectorDetailDto =
        getConnectorDetails(connectorId, mdsId, userId)

    fun getConnectorDetails(connectorId: String, mdsId: String, userId: String): ConnectorDetailDto {
        val connector = connectorService.getConnectorDetailOrThrow(connectorId)

        if (!connectorId.contains(mdsId) && connector.hostMdsId != mdsId) {
            Log.error("Requested connector does not belong to the organization and is not hosted by it. connectorId=$connectorId, mdsId=$mdsId, userId=$userId.")
            error("Connector ID does not match with organization or host organization")
        }

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
            connector.frontendUrl,
            connector.endpointUrl,
            connector.managementUrl,
            buildConnectorStatus(connector)
        )
    }

    fun getAuthorityConnectorDetails(connectorId: String): ConnectorDetailDto {
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
            connector.frontendUrl,
            connector.endpointUrl,
            connector.managementUrl,
            buildConnectorStatus(connector)
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
                it.name,
                if (it.type == ConnectorType.CAAS) it.caasStatus.toDto() else connectorMetadataService.getConnectorStatus(it.connectorId, it.environment).toDto()
            )
        }

        return ConnectorOverviewResult(connectorDtos)
    }

    fun listAllConnectors(environmentId: String): ConnectorOverviewResult {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val connectors = connectorService.getConnectorsByEnvironment(environmentId)
        val orgNames = organizationService.getAllOrganizationNames()

        val connectorDtos = connectors.map {
            ConnectorOverviewEntryDto(
                it.connectorId,
                orgNames[it.providerMdsId] ?: "",
                it.type.toDto(),
                deploymentEnvironmentDtoService.findByIdOrThrow(it.environment),
                it.name,
                if (it.type == ConnectorType.CAAS) it.caasStatus.toDto() else connectorMetadataService.getConnectorStatus(it.connectorId, it.environment).toDto()
            )
        }

        return ConnectorOverviewResult(connectorDtos)
    }

    fun listServiceProvidedConnectors(mdsId: String, environmentId: String): ProvidedConnectorOverviewResult {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val connectors = connectorService.getConnectorsByHostMdsId(mdsId, environmentId)
        val orgNames = organizationService.getAllOrganizationNames()

        val connectorDtos = connectors.map {
            ProvidedConnectorOverviewEntryDto(
                it.connectorId,
                orgNames[it.mdsId] ?: "",
                it.type.toDto(),
                deploymentEnvironmentDtoService.findByIdOrThrow(it.environment),
                it.name,
                if (it.type == ConnectorType.CAAS) it.caasStatus.toDto() else connectorMetadataService.getConnectorStatus(it.connectorId, it.environment).toDto()
            )
        }

        return ProvidedConnectorOverviewResult(connectorDtos)
    }

    fun createOwnConnector(
        connector: CreateConnectorRequest,
        mdsId: String,
        userId: String,
        deploymentEnvId: String = "test"
    ): CreateConnectorResponse {
        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        if (!isValidUrlConfiguration(connector.frontendUrl, connector.endpointUrl, connector.managementUrl)) {
            Log.error("Connector URL is not valid. url=${connector.frontendUrl}, userId=$userId, mdsId=$mdsId.")
            return CreateConnectorResponse.error("Connector URL is not valid.")
        }

        connector.frontendUrl = removeUrlTrailingSlash(connector.frontendUrl)
        connector.endpointUrl = removeUrlTrailingSlash(connector.endpointUrl)
        connector.managementUrl = removeUrlTrailingSlash(connector.managementUrl)

        val connectorId = dataspaceComponentIdUtils.generateDataspaceComponentId(mdsId)
        val clientId = clientIdUtils.generateFromCertificate(connector.certificate)

        if (clientIdUtils.exists(clientId)) {
            Log.error("Connector with this certificate already exists. connectorId=$connectorId, mdsId=$mdsId, userId=$userId, clientId=$clientId.")
            return CreateConnectorResponse.error("Connector with this certificate already exists.")
        }

        connectorService.createOwnConnector(
            connectorId = connectorId,
            mdsId = mdsId,
            environment = deploymentEnvId,
            clientId = clientId,
            connector = connector,
            createdBy = userId
        )
        registerConnectorAtDaps(clientId, connectorId, connector, deploymentEnvId)

        if (!registerConnectorInBroker(deploymentEnvId, connector, connectorId, mdsId, userId)) {
            return CreateConnectorResponse.warning(connectorId, "Connector successfully registered. There were some problems with the broker registration, we will try again later.")
        }

        Log.info("Connector for own organization registered. connectorId=$connectorId, mdsId=$mdsId, userId=$userId.")
        return CreateConnectorResponse.ok(connectorId)
    }

    fun createProvidedConnector(
        connector: CreateConnectorRequest,
        customerMdsId: String,
        providerMdsId: String,
        userId: String,
        deploymentEnvId: String = "test"
    ): CreateConnectorResponse {
        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        if (!isValidUrlConfiguration(connector.frontendUrl, connector.endpointUrl, connector.managementUrl)) {
            Log.error("Connector URL is not valid. url=${connector.frontendUrl}, userId=$userId, customerMdsId=$customerMdsId.")
            return CreateConnectorResponse.error("Connector URL is not valid.")
        }

        connector.frontendUrl = removeUrlTrailingSlash(connector.frontendUrl)
        connector.endpointUrl = removeUrlTrailingSlash(connector.endpointUrl)
        connector.managementUrl = removeUrlTrailingSlash(connector.managementUrl)

        val connectorId = dataspaceComponentIdUtils.generateDataspaceComponentId(customerMdsId)
        val clientId = clientIdUtils.generateFromCertificate(connector.certificate)

        if (clientIdUtils.exists(clientId)) {
            Log.error("Connector with this certificate already exists. connectorId=$connectorId, customerMdsId=$customerMdsId, userId=$userId, clientId=$clientId.")
            return CreateConnectorResponse.error("Connector with this certificate already exists.")
        }

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

        if (!registerConnectorInBroker(deploymentEnvId, connector, connectorId, customerMdsId, userId)) {
            return CreateConnectorResponse.warning(connectorId, "Connector successfully registered. There were some problems with the broker registration, we will try again later.")
        }

        Log.info("Connector for foreign organization registered. connectorId=$connectorId, customerMdsId=$customerMdsId, userId=$userId.")
        return CreateConnectorResponse.ok(connectorId)
    }

    private fun registerConnectorInBroker(deploymentEnvId: String, connector: CreateConnectorRequest, connectorId: String, mdsId: String, userId: String): Boolean {
        try {
            brokerClientService.forEnvironment(deploymentEnvId).addConnector(connector.endpointUrl)
            connectorService.setConnectorBrokerRegistrationStatus(connectorId, ConnectorBrokerRegistrationStatus.REGISTERED)
        } catch (e: Exception) {
            Log.warn("Broker registration for connector unsuccessful. Connector was registered in DAPS & AP regardless. connectorId=$connectorId, mdsId=$mdsId, userId=$userId.", e)
            return false
        }
        return true
    }

    private fun isValidUrlConfiguration(frontendUrlString: String, endpointUrlString: String, managementUrlString: String): Boolean {
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
        return if (url.endsWith("/")) {
            url.dropLast(1)
        } else {
            url
        }
    }

    fun deleteConnector(
        connectorId: String,
        mdsId: String,
        userId: String
    ): IdResponse {
        val connector = connectorService.getConnectorOrThrow(connectorId)

        if (!connectorId.startsWith(mdsId) && connector.providerMdsId != mdsId) {
            Log.error("To be deleted connector does not belong to user's organization and is not hosted by it. connectorId=$connectorId, mdsId=$mdsId, userId=$userId.")
            error("Connector ID does not match MDS-ID of the user's organization or host organization")
        }

        val deploymentEnvId = connector.environment

        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        if (connector.type == ConnectorType.CAAS) {
            caasClient.deleteCaas(listOf(connectorId))
        }

        dapsClientService.forEnvironment(deploymentEnvId).deleteClient(connector.clientId)
        brokerClientService.forEnvironment(deploymentEnvId).removeConnector(connector.endpointUrl)
        connectorService.deleteConnector(connectorId)

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
        dapsClient.configureMappers(clientId, connectorId, connector.certificate)
    }

    private fun buildConnectorStatus(connector: ConnectorService.ConnectorDetailRs): ConnectorStatusDto {
        return if (connector.type == ConnectorType.CAAS) {
            connector.caasStatus!!.toDto()
        } else {
            connectorMetadataService.getConnectorStatus(connector.connectorId, connector.environment).toDto()
        }
    }
}
