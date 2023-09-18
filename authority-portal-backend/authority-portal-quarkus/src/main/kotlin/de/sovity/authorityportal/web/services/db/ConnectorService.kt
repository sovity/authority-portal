package de.sovity.authorityportal.web.services.db

import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.time.OffsetDateTime

@ApplicationScoped
class ConnectorService {

    @Inject
    lateinit var dsl: DSLContext

    fun createOwnConnector(
        connectorId: String,
        mdsId: String,
        environment: String,
        clientId: String,
        connector: CreateConnectorRequest,
        createdBy: String
    ) {
        createConnector(
            connectorId = connectorId,
            mdsId = mdsId,
            providerMdsId = mdsId,
            type = ConnectorType.OWN,
            environment = environment,
            clientId = clientId,
            connector = connector,
            createdBy = createdBy
        )
    }

    fun createProvidedConnector(
        connectorId: String,
        mdsId: String,
        providerMdsId: String,
        environment: String,
        clientId: String,
        connector: CreateConnectorRequest,
        createdBy: String
    ) {
        createConnector(
            connectorId = connectorId,
            mdsId = mdsId,
            providerMdsId = providerMdsId,
            type = ConnectorType.PROVIDED,
            environment = environment,
            clientId = clientId,
            connector = connector,
            createdBy = createdBy
        )
    }

    private fun createConnector(
        connectorId: String,
        mdsId: String,
        providerMdsId: String,
        type: ConnectorType,
        environment: String,
        clientId: String,
        connector: CreateConnectorRequest,
        createdBy: String
    ) {
        dsl.newRecord(Tables.CONNECTOR). also {
            it.connectorId = connectorId
            it.mdsId = mdsId
            it.providerMdsId = providerMdsId
            it.type = type
            it.environment = environment
            it.clientId = clientId
            it.name = connector.name
            it.location = connector.location
            it.url = connector.url
            it.createdBy = createdBy
            it.createdAt = OffsetDateTime.now()

            it.insert()
        }
    }

    fun deleteConnector(connectorId: String) {
        val c = Tables.CONNECTOR
        dsl.deleteFrom(c)
            .where(c.CONNECTOR_ID.eq(connectorId))
            .execute()
    }

    fun getClientIdByConnectorId(connectorId: String): String {
        val c = Tables.CONNECTOR
        return dsl.select(c.CLIENT_ID)
            .from(c)
            .where(c.CONNECTOR_ID.eq(connectorId))
            .fetchOne(c.CLIENT_ID) ?: error("Connector with id $connectorId not found")
    }
}
