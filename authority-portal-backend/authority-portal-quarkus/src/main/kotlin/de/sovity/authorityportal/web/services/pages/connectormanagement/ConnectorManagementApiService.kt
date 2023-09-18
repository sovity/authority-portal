package de.sovity.authorityportal.web.services.pages.connectormanagement

import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.web.services.db.ConnectorService
import de.sovity.authorityportal.web.services.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.services.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.services.utils.idmanagement.ClientIdUtils
import de.sovity.authorityportal.web.services.utils.idmanagement.ConnectorIdUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class ConnectorManagementApiService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var connectorIdUtils: ConnectorIdUtils

    @Inject
    lateinit var clientIdUtils: ClientIdUtils

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var dapsClientService: DapsClientService

    @Inject
    lateinit var brokerClientService: BrokerClientService

    fun createOwnConnector(
        userId: String,
        mdsId: String,
        connector: CreateConnectorRequest,
        deploymentEnvId: String = "test"
    ): String {
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

        return connectorId
    }

    fun createProvidedConnector(
        userId: String,
        providerMdsId: String,
        customerMdsId: String,
        connector: CreateConnectorRequest,
        deploymentEnvId: String = "test"
    ): String {
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

        return connectorId
    }

    /**
     * Not yet working. Wait for Broker API.
     */
    fun deleteOwnConnector(
        mdsId: String,
        connectorId: String,
        deploymentEnvId: String = "test"
    ): String {
        if (!connectorId.startsWith(mdsId)) {
            error("Connector ID does not match MDS-ID of the user's organization")
        }
        deploymentEnvironmentService.assertValidEnvId(deploymentEnvId)

        val deploymentEnvironment = deploymentEnvironmentService.findByIdOrThrow(deploymentEnvId)
        val clientId = connectorService.getClientIdByConnectorId(connectorId)

        connectorService.deleteConnector(connectorId)
        dapsClientService.forEnvironment(deploymentEnvId).deleteClient(clientId)
        brokerClientService.forEnvironment(deploymentEnvId).removeConnector("TODO") // TODO: Wait for Broker API

        return connectorId
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
