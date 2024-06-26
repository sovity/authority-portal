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

package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.broker.dao.utils.eqAny
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorBrokerRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.db.jooq.tables.records.ConnectorRecord
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jooq.DSLContext
import java.util.Optional

@ApplicationScoped
class ConnectorService(
    val dsl: DSLContext,
    val timeUtils: TimeUtils,
    @ConfigProperty(name = "authority-portal.caas.sovity.limit-per-mdsid") val caasLimitPerMdsId: Optional<Int>
) {

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
        val caasStatus: CaasStatus?,
        val onlineStatus: ConnectorOnlineStatus?
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
            c.CAAS_STATUS.`as`("caasStatus"),
            c.ONLINE_STATUS.`as`("onlineStatus")
        )
            .from(c)
            .leftJoin(org).on(c.MDS_ID.eq(org.MDS_ID))
            .leftJoin(host).on(c.PROVIDER_MDS_ID.eq(host.MDS_ID))
            .where(c.CONNECTOR_ID.eq(connectorId))
            .fetchOneInto(ConnectorDetailRs::class.java)
    }

    fun getProvidedConnectorsByMdsId(mdsId: String, environment: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(
                c.TYPE.eq(ConnectorType.PROVIDED),
                c.PROVIDER_MDS_ID.eq(mdsId),
                c.ENVIRONMENT.eq(environment)
            )
            .fetch()
    }

    fun updateConnectorsCreator(newCreatedBy: String, oldCreatedBy: String) {
        val c = Tables.CONNECTOR
        dsl.update(c)
            .set(c.CREATED_BY, newCreatedBy)
            .where(c.CREATED_BY.eq(oldCreatedBy))
            .execute()
    }

    fun deleteProviderReferences(mdsId: String) {
        val c = Tables.CONNECTOR
        dsl.update(c)
            .setNull(c.PROVIDER_MDS_ID)
            .where(c.PROVIDER_MDS_ID.eq(mdsId))
            .execute()
    }

    fun getConnectorsByMdsIdAndEnvironment(mdsId: String, environmentId: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.MDS_ID.eq(mdsId).and(c.ENVIRONMENT.eq(environmentId)))
            .fetch()
    }

    fun getConnectorsByMdsId(mdsId: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.MDS_ID.eq(mdsId))
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

    fun getConnectorCountByMdsIdAndEnvironment(mdsId: String, environmentId: String): Int {
        val c = Tables.CONNECTOR
        return dsl.fetchCount(
            dsl.selectFrom(c).where(c.MDS_ID.eq(mdsId), c.ENVIRONMENT.eq(environmentId))
        )
    }

    fun getCaasCountByMdsIdAndEnvironment(mdsId: String, environmentId: String): Int {
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
        return getCaasCountByMdsIdAndEnvironment(mdsId, environmentId) < limit
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
            it.name = name.trim()
            it.createdBy = createdBy
            it.createdAt = timeUtils.now()
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
            it.name = connector.name.trim()
            it.location = connector.location.trim()
            it.frontendUrl = connector.frontendUrl.trim()
            it.endpointUrl = connector.endpointUrl.trim()
            it.managementUrl = connector.managementUrl.trim()
            it.createdBy = createdBy
            it.createdAt = timeUtils.now()
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
            .where(c.CONNECTOR_ID.eqAny(connectorIds))
            .execute()
    }

    fun setConnectorBrokerRegistrationStatus(connectorId: String, status: ConnectorBrokerRegistrationStatus) {
        setConnectorBrokerRegistrationStatus(listOf(connectorId), status)
    }

    fun getUnregisteredBrokerConnectors(): List<UnregisteredBrokerConnector> {
        val c = Tables.CONNECTOR
        return dsl.select(
            c.CONNECTOR_ID.`as`("connectorId"),
            c.MDS_ID.`as`("mdsId"),
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
        val mdsId: String,
        val connectorEndpointUrl: String,
        val environmentId: String
    )
}
