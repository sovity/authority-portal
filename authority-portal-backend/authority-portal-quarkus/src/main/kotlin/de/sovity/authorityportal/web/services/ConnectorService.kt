package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorBrokerRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.db.jooq.tables.records.ConnectorRecord
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.time.OffsetDateTime
import java.util.Optional

@ApplicationScoped
class ConnectorService {

    @Inject
    lateinit var dsl: DSLContext

    @ConfigProperty(name = "authority-portal.caas.sovity.limit-per-mdsid")
    lateinit var caasLimitPerMdsId: Optional<Int>

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
        val hostName: String?,
        val hostMdsId: String?,
        val environment: String,
        val connectorName: String,
        val location: String,
        val frontendUrl: String?,
        val endpointUrl: String?,
        val managementUrl: String?,
        val caasStatus: CaasStatus?
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
            c.FRONTEND_URL.`as`("frontendUrl"),
            c.ENDPOINT_URL.`as`("endpointUrl"),
            c.MANAGEMENT_URL.`as`("managementUrl"),
            c.CAAS_STATUS.`as`("caasStatus")
        )
            .from(c)
            .leftJoin(org).on(c.MDS_ID.eq(org.MDS_ID))
            .leftJoin(host).on(c.PROVIDER_MDS_ID.eq(host.MDS_ID))
            .where(c.CONNECTOR_ID.eq(connectorId))
            .fetchOneInto(ConnectorDetailRs::class.java)
    }

    fun getConnectorsByMdsId(mdsId: String, environmentId: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.MDS_ID.eq(mdsId).and(c.ENVIRONMENT.eq(environmentId)))
            .fetch()
    }

    fun getConnectorsByHostMdsId(mdsId: String, environmentId: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.PROVIDER_MDS_ID.eq(mdsId).and(c.ENVIRONMENT.eq(environmentId)))
            .fetch()
    }

    fun getConnectorsByEnvironment(environment: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.ENVIRONMENT.eq(environment))
            .fetch()
    }

    fun getConnectorCountByMdsId(mdsId: String, environmentId: String): Int {
        val c = Tables.CONNECTOR
        return dsl.fetchCount(
            dsl.selectFrom(c).where(c.MDS_ID.eq(mdsId), c.ENVIRONMENT.eq(environmentId))
        )
    }

    fun getCaasCountByMdsId(mdsId: String, environmentId: String): Int {
        val c = Tables.CONNECTOR
        return dsl.fetchCount(
            dsl.selectFrom(c)
                .where(c.MDS_ID.eq(mdsId).and(c.ENVIRONMENT.eq(environmentId)))
                .and(c.TYPE.eq(ConnectorType.CAAS))
        )
    }

    fun assertCaasRegistrationLimit(mdsId: String, environmentId: String): Boolean {
        val limit = caasLimitPerMdsId.orElseThrow {
            error("No limit configured for CaaS registration")
        }
        return getCaasCountByMdsId(mdsId, environmentId) < limit
    }

    fun getConnectorCountsByMdsIds(environment: String): Map<String, Int> {
        val c = Tables.CONNECTOR

        return dsl.select(c.MDS_ID, DSL.count())
            .from(c)
            .where(c.ENVIRONMENT.eq(environment))
            .groupBy(c.MDS_ID)
            .fetchMap(c.MDS_ID, DSL.count())
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

    fun createCaas(
        connectorId: String,
        clientId: String,
        mdsId: String,
        name: String,
        createdBy: String,
        status: CaasStatus,
        environmentId: String
    ) {
        dsl.newRecord(Tables.CONNECTOR).also {
            it.connectorId = connectorId
            it.clientId = clientId
            it.mdsId = mdsId
            it.name = name
            it.createdBy = createdBy
            it.createdAt = OffsetDateTime.now()
            it.caasStatus = status
            it.environment = environmentId
            it.type = ConnectorType.CAAS
            it.location = "CaaS"
            it.insert()
        }
    }

    fun getCaas(connectorId: String): ConnectorRecord? {
        val c = Tables.CONNECTOR
        return dsl.selectFrom(c)
            .where(c.CONNECTOR_ID.eq(connectorId).and(c.TYPE.eq(ConnectorType.CAAS)))
            .fetchOne()
    }

    fun getAllCaas(): List<ConnectorRecord> {
        val c = Tables.CONNECTOR
        return dsl.selectFrom(c)
            .where(c.TYPE.eq(ConnectorType.CAAS))
            .fetch()
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
        dsl.newRecord(Tables.CONNECTOR).also {
            it.connectorId = connectorId
            it.mdsId = mdsId
            it.providerMdsId = providerMdsId
            it.type = type
            it.environment = environment
            it.clientId = clientId
            it.name = connector.name
            it.location = connector.location
            it.frontendUrl = connector.frontendUrl
            it.endpointUrl = connector.endpointUrl
            it.managementUrl = connector.managementUrl
            it.createdBy = createdBy
            it.createdAt = OffsetDateTime.now()
            it.brokerRegistrationStatus = ConnectorBrokerRegistrationStatus.UNREGISTERED

            it.insert()
        }
    }

    fun deleteConnector(connectorId: String) {
        val c = Tables.CONNECTOR
        dsl.deleteFrom(c)
            .where(c.CONNECTOR_ID.eq(connectorId))
            .execute()
    }

    fun setConnectorBrokerRegistrationStatus(connectorIds: List<String>, status: ConnectorBrokerRegistrationStatus) {
        val c = Tables.CONNECTOR
        dsl.update(c)
            .set(c.BROKER_REGISTRATION_STATUS, status)
            .where(c.CONNECTOR_ID.`in`(connectorIds))
            .execute()
    }

    fun setConnectorBrokerRegistrationStatus(connectorId: String, status: ConnectorBrokerRegistrationStatus) {
        setConnectorBrokerRegistrationStatus(listOf(connectorId), status)
    }

    fun getUnregisteredBrokerConnectors(): List<UnregisteredBrokerConnector> {
        val c = Tables.CONNECTOR
        return dsl.select(
            c.CONNECTOR_ID.`as`("connectorId"),
            c.ENDPOINT_URL.`as`("connectorEndpointUrl"),
            c.ENVIRONMENT.`as`("environmentId")
        )
            .from(c)
            .where(c.BROKER_REGISTRATION_STATUS.eq(ConnectorBrokerRegistrationStatus.UNREGISTERED))
            .and(c.CAAS_STATUS.notEqual(CaasStatus.PROVISIONING).or(c.CAAS_STATUS.isNull))
            .fetchInto(UnregisteredBrokerConnector::class.java)
    }

    data class UnregisteredBrokerConnector(
        val connectorId: String,
        val connectorEndpointUrl: String,
        val environmentId: String
    )
}
