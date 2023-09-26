package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.db.jooq.tables.records.ConnectorRecord
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.time.OffsetDateTime

@ApplicationScoped
class ConnectorService {

    @Inject
    lateinit var dsl: DSLContext

    fun getConnectorOrThrow(connectorId: String): ConnectorRecord {
        return getConnector(connectorId) ?: error("Connector with id $connectorId not found")
    }

    private fun getConnector(connectorId: String): ConnectorRecord? {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.CONNECTOR_ID.eq(connectorId))
            .fetchOne()
    }

    data class ConnectorDetailRs(
        val connectorId: String,
        val type: ConnectorType,
        val orgName: String,
        val orgMdsId: String,
        val hostName: String,
        val hostMdsId: String,
        val environment: String,
        val connectorName: String,
        val location: String,
        val url: String,
    )

    fun getConnectorDetailOrThrow(connectorId: String): ConnectorDetailRs {
        return getConnectorDetail(connectorId) ?: error("Connector with id $connectorId not found")
    }

    private fun getConnectorDetail(connectorId: String): ConnectorDetailRs? {
        val c = Tables.CONNECTOR
        val org = Tables.ORGANIZATION.`as`("org")
        val host = Tables.ORGANIZATION.`as`("host")

        return dsl.select(
            c.CONNECTOR_ID.`as`("connectorId"),
            c.TYPE.`as`("type"),
            org.NAME.`as`("orgName"),
            org.MDS_ID.`as`("orgMdsId"),
            host.NAME.`as`("hostName"),
            host.MDS_ID.`as`("hostMdsId"),
            c.ENVIRONMENT.`as`("environment"),
            c.NAME.`as`("connectorName"),
            c.LOCATION.`as`("location"),
            c.URL.`as`("url")
        )
            .from(c)
            .leftJoin(org).on(c.MDS_ID.eq(org.MDS_ID))
            .leftJoin(host).on(c.PROVIDER_MDS_ID.eq(host.MDS_ID))
            .where(c.CONNECTOR_ID.eq(connectorId))
            .fetchOneInto(ConnectorDetailRs::class.java)
    }

    fun getConnectorsByMdsId(mdsId: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.MDS_ID.eq(mdsId))
            .fetch()
    }

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
