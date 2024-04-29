package de.sovity.authorityportal.web.services.reporting.utils

import de.sovity.authorityportal.db.jooq.tables.records.ConnectorRecord
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class ConnectorCsvReportUtils {

    @Inject
    lateinit var brokerClientService: BrokerClientService

    fun getConnectorStatusesFromBroker(environmentId: String, connectors: List<ConnectorRecord>): Map<String, ConnectorOnlineStatus?> {
        return brokerClientService
            .forEnvironment(environmentId)
            .getConnectorMetadata(connectors.map { it.endpointUrl })
            .associate { it.connectorEndpoint to it.onlineStatus }
    }
}
