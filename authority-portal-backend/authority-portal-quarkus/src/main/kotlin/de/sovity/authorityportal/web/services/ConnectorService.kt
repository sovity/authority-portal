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

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorBrokerRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.db.jooq.tables.records.ConnectorRecord
import de.sovity.authorityportal.web.model.CreateConnectorParams
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jooq.DSLContext
import java.util.Optional

@ApplicationScoped
class ConnectorService(
    val dsl: DSLContext,
    val timeUtils: TimeUtils,
    @ConfigProperty(name = "authority-portal.caas.sovity.limit-per-organization") val caasLimitPerOrganizationId: Optional<Int>
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
        val organizationId: String,
        val hostName: String?,
        val hostOrganizationId: String?,
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
            org.ID.`as`("organizationId"),
            host.NAME.`as`("hostName"),
            host.ID.`as`("hostOrganizationId"),
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
            .leftJoin(org).on(c.ORGANIZATION_ID.eq(org.ID))
            .leftJoin(host).on(c.PROVIDER_ORGANIZATION_ID.eq(host.ID))
            .where(c.CONNECTOR_ID.eq(connectorId))
            .fetchOneInto(ConnectorDetailRs::class.java)
    }

    fun updateConnectorsCreator(newCreatedBy: String, oldCreatedBy: String) {
        val c = Tables.CONNECTOR
        dsl.update(c)
            .set(c.CREATED_BY, newCreatedBy)
            .where(c.CREATED_BY.eq(oldCreatedBy))
            .execute()
    }

    fun deleteProviderReferences(organizationId: String) {
        val c = Tables.CONNECTOR
        dsl.update(c)
            .setNull(c.PROVIDER_ORGANIZATION_ID)
            .where(c.PROVIDER_ORGANIZATION_ID.eq(organizationId))
            .execute()
    }

    fun getConnectorsByOrganizationIdAndEnvironment(organizationId: String, environmentId: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.ORGANIZATION_ID.eq(organizationId).and(c.ENVIRONMENT.eq(environmentId)))
            .orderBy(c.CONNECTOR_ID.asc())
            .fetch()
    }

    fun getConnectorsByOrganizationId(organizationId: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.ORGANIZATION_ID.eq(organizationId))
            .orderBy(c.CONNECTOR_ID.asc())
            .fetch()
    }

    fun getConnectorsByHostOrganizationId(organizationId: String, environmentId: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.PROVIDER_ORGANIZATION_ID.eq(organizationId).and(c.ENVIRONMENT.eq(environmentId)))
            .orderBy(c.CONNECTOR_ID.asc())
            .fetch()
    }

    fun getConnectorsByEnvironment(environment: String): List<ConnectorRecord> {
        val c = Tables.CONNECTOR

        return dsl.selectFrom(c)
            .where(c.ENVIRONMENT.eq(environment))
            .orderBy(c.CONNECTOR_ID.asc())
            .fetch()
    }

    fun getConnectorCountByOrganizationIdAndEnvironment(organizationId: String, environmentId: String): Int {
        val c = Tables.CONNECTOR
        return dsl.fetchCount(
            dsl.selectFrom(c).where(c.ORGANIZATION_ID.eq(organizationId), c.ENVIRONMENT.eq(environmentId))
        )
    }

    fun getCaasCountByOrganizationIdAndEnvironment(organizationId: String, environmentId: String): Int {
        val c = Tables.CONNECTOR
        return dsl.fetchCount(
            dsl.selectFrom(c)
                .where(c.ORGANIZATION_ID.eq(organizationId).and(c.ENVIRONMENT.eq(environmentId)))
                .and(c.TYPE.eq(ConnectorType.CAAS))
        )
    }

    fun assertCaasRegistrationLimit(organizationId: String, environmentId: String): Boolean {
        val limit = caasLimitPerOrganizationId.orElseThrow {
            error("No limit configured for CaaS registration")
        }
        return getCaasCountByOrganizationIdAndEnvironment(organizationId, environmentId) < limit
    }

    fun createOwnConnector(
        connectorId: String,
        organizationId: String,
        environment: String,
        clientId: String,
        createConnectorParams: CreateConnectorParams,
        createdBy: String
    ) {
        createConnector(
            connectorId = connectorId,
            organizationId = organizationId,
            providerOrganizationId = organizationId,
            type = ConnectorType.OWN,
            environment = environment,
            clientId = clientId,
            createConnectorParams = createConnectorParams,
            createdBy = createdBy
        )
    }

    fun createProvidedConnector(
        connectorId: String,
        organizationId: String,
        providerOrganizationId: String,
        environment: String,
        clientId: String,
        createConnectorParams: CreateConnectorParams,
        createdBy: String
    ) {
        createConnector(
            connectorId = connectorId,
            organizationId = organizationId,
            providerOrganizationId = providerOrganizationId,
            type = ConnectorType.PROVIDED,
            environment = environment,
            clientId = clientId,
            createConnectorParams = createConnectorParams,
            createdBy = createdBy
        )
    }

    fun createCaas(
        connectorId: String,
        clientId: String,
        organizationId: String,
        name: String,
        createdBy: String,
        status: CaasStatus,
        environmentId: String,
        providerOrganizationId: String? = null
    ) {
        dsl.newRecord(Tables.CONNECTOR).also {
            it.connectorId = connectorId
            it.clientId = clientId
            it.organizationId = organizationId
            it.providerOrganizationId = providerOrganizationId
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

    fun getAllCaas(): List<ConnectorRecord> {
        val c = Tables.CONNECTOR
        return dsl.selectFrom(c)
            .where(c.TYPE.eq(ConnectorType.CAAS))
            .fetch()
    }

    private fun createConnector(
        connectorId: String,
        organizationId: String,
        providerOrganizationId: String,
        type: ConnectorType,
        environment: String,
        clientId: String,
        createConnectorParams: CreateConnectorParams,
        createdBy: String
    ) {
        dsl.newRecord(Tables.CONNECTOR).also {
            it.connectorId = connectorId
            it.organizationId = organizationId
            it.providerOrganizationId = providerOrganizationId
            it.type = type
            it.environment = environment
            it.clientId = clientId
            it.name = createConnectorParams.name
            it.location = createConnectorParams.location
            it.frontendUrl = createConnectorParams.frontendUrl
            it.endpointUrl = createConnectorParams.endpointUrl
            it.managementUrl = createConnectorParams.managementUrl
            it.jwksUrl = createConnectorParams.jwksUrl
            it.createdBy = createdBy
            it.createdAt = timeUtils.now()
            it.brokerRegistrationStatus = ConnectorBrokerRegistrationStatus.UNREGISTERED

            it.insert()
        }
    }

    fun deleteConnectorFromDb(connectorId: String) {
        val dv = Tables.DATA_OFFER_VIEW_COUNT
        dsl.delete(dv)
            .where(dv.CONNECTOR_ID.eq(connectorId))
            .execute()

        val co = Tables.CONTRACT_OFFER
        dsl.deleteFrom(co)
            .where(co.CONNECTOR_ID.eq(connectorId))
            .execute()

        val d = Tables.DATA_OFFER
        dsl.deleteFrom(d)
            .where(d.CONNECTOR_ID.eq(connectorId))
            .execute()

        val c = Tables.CONNECTOR
        dsl.deleteFrom(c)
            .where(c.CONNECTOR_ID.eq(connectorId))
            .execute()
    }
}
