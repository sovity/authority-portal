package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorBrokerRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.ConnectorRecord
import de.sovity.authorityportal.web.pages.connectormanagement.toDb
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.caas.CaasClient
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasStatusResponse
import de.sovity.authorityportal.web.thirdparty.caas.model.ConnectorStatus
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext

@ApplicationScoped
class CaasRegistrationService {

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var caasClient: CaasClient

    @Inject
    lateinit var dapsClientService: DapsClientService

    @Inject
    lateinit var brokerClientService: BrokerClientService

    @Scheduled(every = "1m")
    fun scheduledCaasStatusUpdate() {
        val connectors = connectorService.getAllCaas()
        val connectorStatusList = caasClient.getCaasStatus(connectors.map { it.connectorId })
        val connectorStatusMap = buildConnectorStatusMap(connectorStatusList, connectors)

        updateCaasStatus(connectorStatusMap)
        dsl.batchUpdate(connectorStatusMap.keys).execute()
    }

    private fun updateCaasStatus(connectorStatusMap: Map<ConnectorRecord, CaasStatusResponse>) {
        connectorStatusMap.forEach { (connector, caasStatusResponse) ->
            updateConnectorUrls(connector, caasStatusResponse)

            if ((connector.caasStatus == CaasStatus.PROVISIONING || connector.caasStatus == CaasStatus.AWAITING_RUNNING)
                && caasStatusResponse.status == ConnectorStatus.RUNNING) {
                registerCaasAtDaps(connector)
                registerCaasAtBroker(connector)
                Log.info("CaaS has been registered at Broker & DAPS. connectorId=${connector.connectorId}.")
            }

            connector.caasStatus = caasStatusResponse.status.toDb()
        }
    }

    private fun updateConnectorUrls(connector: ConnectorRecord, caasStatusResponse: CaasStatusResponse) {
        connector.frontendUrl = caasStatusResponse.frontendUrl
        connector.endpointUrl = caasStatusResponse.connectorEndpointUrl
        connector.managementUrl = caasStatusResponse.managementApiUrl
        connector.jwksUrl = caasStatusResponse.connectorJwksUrl
    }

    private fun buildConnectorStatusMap(connectorStatusList: List<CaasStatusResponse>, connectors: List<ConnectorRecord>): Map<ConnectorRecord, CaasStatusResponse> {
        val connectorStatusMap = connectorStatusList
                .associateBy { it.connectorId }
                .mapNotNull { (connectorId, connectorStatusList) ->
                    connectors.find { it.connectorId == connectorId }?.let { it to connectorStatusList }
                }
                .toMap()
        return connectorStatusMap
    }

    private fun registerCaasAtDaps(connector: ConnectorRecord) {
        try {
            val dapsClient = dapsClientService.forEnvironment(connector.environment)
            dapsClient.createClient(connector.clientId)
            dapsClient.addJwksUrl(connector.clientId, connector.jwksUrl)
            dapsClient.configureMappers(connector.clientId, connector.connectorId)
        } catch (e: Exception) {
            Log.error("Error registering CaaS at DAPS. connectorId=${connector.connectorId}, mdsId=${connector.mdsId}.", e)
            error("Error registering CaaS at DAPS. connectorId=${connector.connectorId}, mdsId=${connector.mdsId}.")
        }

    }

    private fun registerCaasAtBroker(connector: ConnectorRecord) {
        try {
            brokerClientService.forEnvironment(connector.environment).addConnector(connector.endpointUrl)
            connectorService.setConnectorBrokerRegistrationStatus(connector.connectorId, ConnectorBrokerRegistrationStatus.REGISTERED)
        } catch (e: Exception) {
            Log.warn("Broker registration for CaaS unsuccessful, we will try again later. connectorId=${connector.connectorId}, mdsId=${connector.mdsId}.", e)
        }
    }
}
