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

package de.sovity.authorityportal.web.integration.pages.connectormanagement

import de.sovity.authorityportal.api.model.ConnectorStatusDto
import de.sovity.authorityportal.api.model.ConnectorTypeDto
import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.api.model.CreateConnectorStatusDto
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.web.pages.connectormanagement.ConnectorManagementApiService
import de.sovity.authorityportal.web.services.ConnectorMetadataService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClient
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.broker.model.AddedConnector
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus
import de.sovity.authorityportal.web.thirdparty.daps.DapsClient
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.anyList
import org.mockito.Mockito.anyString
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.kotlin.any
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify
import java.time.OffsetDateTime

@QuarkusTest
class ConnectorManagementApiServiceTest {

    @Inject
    lateinit var connectorManagementApiService: ConnectorManagementApiService

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var connectorMetadataService: ConnectorMetadataService

    private val test = "test"
    private val mdsId = "MDSL2222BB"
    private val connectorId = "MDSL2222BB.CP59I8U"
    private val userId = "00000000-0000-0000-0000-000000000001"
    private val connectorName = "testName"
    private val connectorLocation = "testLocation"
    private val connectorFrontendUrl = "https://xample.test1/connector"
    private val connectorEndpointUrl = "https://xample.test1/connector/api/dsp"
    private val connectorManagementUrl = "https://xample.test1/connector/api/management"
    private val connectorCertificate = "testCertificate"
    private val otherMdsId = "MDSL1111AA"

    @BeforeEach
    fun init() {
        connectorService.dsl
            .deleteFrom(de.sovity.authorityportal.db.jooq.Tables.CONNECTOR)
            .where(de.sovity.authorityportal.db.jooq.Tables.CONNECTOR.CLIENT_ID.eq(test))
            .execute()
        val brokerClientService = mock(BrokerClientService::class.java)
        val brokerClient = mock(BrokerClient::class.java)

        QuarkusMock.installMockForType(brokerClientService, BrokerClientService::class.java)
        `when`(brokerClientService.forEnvironment(eq(test))).thenReturn(brokerClient)
        `when`(brokerClient.getConnectorMetadata(anyList())).thenReturn(listOf(AuthorityPortalConnectorInfo().also {
            it.connectorEndpoint = connectorEndpointUrl
            it.dataOfferCount = 1
            it.offlineSinceOrLastUpdatedAt = OffsetDateTime.now()
            it.onlineStatus = ConnectorOnlineStatus.ONLINE
            it.participantId = connectorId
        }))
    }

    @Test
    @TestTransaction
    fun testGetAllDeploymentEnvironment() {
        // act
        val result = connectorManagementApiService.getAllDeploymentEnvironment()

        // assert
        assertThat(result).hasSize(1)
        assertThat(result[0].environmentId).isEqualTo(test)
        assertThat(result[0].title).isEqualTo("Test Environment")
    }

    @Test
    @TestTransaction
    fun testGetConnectorDetailsException() {
        assertThatThrownBy { connectorManagementApiService.getConnectorDetails("testConnectorId", "testMdsId", "testUserId") }
            .isInstanceOf(java.lang.IllegalStateException::class.java)
    }

    @Test
    @TestTransaction
    fun testGetConnectorDetails() {
        // arrange
        connectorMetadataService.fetchConnectorMetadata()

        // act
        val result = connectorManagementApiService.getConnectorDetails(connectorId, mdsId, userId)

        print(result)

        // assert
        assertThat(result).isNotNull
        assertThat(result.connectorId).isEqualTo(connectorId)
        assertThat(result.type).isEqualTo(ConnectorTypeDto.OWN)
        assertThat(result.orgName).isEqualTo("Dev Organization 2")
        assertThat(result.orgMdsId).isEqualTo(mdsId)
        assertThat(result.hostName).isEqualTo("Dev Organization 2")
        assertThat(result.hostMdsId).isEqualTo(mdsId)
        assertThat(result.environment.environmentId).isEqualTo(test)
        assertThat(result.environment.title).isEqualTo("Test Environment")
        assertThat(result.connectorName).isEqualTo("Example Connector")
        assertThat(result.location).isEqualTo("Here")
        assertThat(result.frontendUrl).isEqualTo("https://xample.test1/connector")
        assertThat(result.status).isEqualTo(ConnectorStatusDto.ONLINE)
    }

    @Test
    @TestTransaction
    fun testListOrganizationConnectors() {
        // arrange
        val mdsId = "MDSL2222BB"

        // act
        val result = connectorManagementApiService.listOrganizationConnectors(mdsId, test)

        // assert
        assertThat(result).isNotNull
        assertThat(result.connectors).hasSize(3)
        assertThat(result.connectors.map { it.id }).allSatisfy { assertThat(it).isNotNull() }
        assertThat(result.connectors.map { it.hostName }).allSatisfy { assertThat(it).isEqualTo("Dev Organization 2") }
        assertThat(result.connectors.map { it.type }).allSatisfy { assertThat(it).isEqualTo(ConnectorTypeDto.OWN) }
        assertThat(result.connectors.map { it.environment.environmentId }).allSatisfy { assertThat(it).isEqualTo("test") }
        assertThat(result.connectors.map { it.environment.title }).allSatisfy { assertThat(it).isEqualTo("Test Environment") }
        assertThat(result.connectors.map { it.name }).allSatisfy { assertThat(it).isEqualTo("Example Connector") }
    }

    @Test
    @TestTransaction
    fun testListAllConnectors() {
        // act
        val result = connectorManagementApiService.listAllConnectors(test)

        // assert
        assertThat(result).isNotNull
        assertThat(result.connectors).hasSize(7)
        assertThat(result.connectors.map { it.id }).allSatisfy { assertThat(it).isNotNull() }
        assertThat(result.connectors.map { it.hostName }).anySatisfy { assertThat(it).isEqualTo("Dev Organization 1") }
        assertThat(result.connectors.map { it.hostName }).anySatisfy { assertThat(it).isEqualTo("Dev Organization 2") }
        assertThat(result.connectors.map { it.environment.environmentId }).allSatisfy { assertThat(it).isEqualTo("test") }
        assertThat(result.connectors.map { it.environment.title }).allSatisfy { assertThat(it).isEqualTo("Test Environment") }
        assertThat(result.connectors.map { it.name }).allSatisfy { assertThat(it).isNotBlank() }
    }

    @Test
    @TestTransaction
    fun testListProvidedConnectors() {
        // act
        val result = connectorManagementApiService.listServiceProvidedConnectors(otherMdsId, test)

        // assert
        assertThat(result).isNotNull
        assertThat(result.connectors).hasSize(1)
        assertThat(result.connectors.map { it.id }).allSatisfy { assertThat(it).isNotNull() }
        assertThat(result.connectors.map { it.customerOrgName }).anySatisfy { assertThat(it).isEqualTo("Dev Organization 3.5") }
        assertThat(result.connectors.map { it.environment.environmentId }).allSatisfy { assertThat(it).isEqualTo("test") }
        assertThat(result.connectors.map { it.environment.title }).allSatisfy { assertThat(it).isEqualTo("Test Environment") }
        assertThat(result.connectors.map { it.type }).allSatisfy { assertThat(it).isEqualTo(ConnectorTypeDto.PROVIDED) }
    }

    @Test
    @TestTransaction
    fun testCreateOwnConnector() {
        // arrange
        val clientIdUtilsMock = mock(ClientIdUtils::class.java)
        doReturn(test).`when`(clientIdUtilsMock).generateFromCertificate(eq(connectorCertificate))

        val dapsClient = mock(DapsClient::class.java)
        val dapsClientService = mock(DapsClientService::class.java)
        `when`(dapsClientService.forEnvironment(eq(test))).thenReturn(dapsClient)

        val brokerClient = mock(BrokerClient::class.java)
        val brokerClientService = mock(BrokerClientService::class.java)
        `when`(brokerClientService.forEnvironment(eq(test))).thenReturn(brokerClient)
        doNothing().`when`(brokerClient).addConnector(any())

        QuarkusMock.installMockForType(clientIdUtilsMock, ClientIdUtils::class.java)
        QuarkusMock.installMockForType(brokerClientService, BrokerClientService::class.java)
        QuarkusMock.installMockForType(dapsClientService, DapsClientService::class.java)
        val connectorRequest = CreateConnectorRequest(connectorName, connectorLocation, connectorFrontendUrl, connectorEndpointUrl, connectorManagementUrl, connectorCertificate)

        // act
        val response = connectorManagementApiService.createOwnConnector(connectorRequest, otherMdsId, userId)

        // assert
        verify(clientIdUtilsMock).generateFromCertificate(eq(connectorCertificate))
        verify(brokerClientService).forEnvironment(eq(test))
        verify(brokerClient).addConnector(any())
        verify(dapsClientService).forEnvironment(eq(test))
        assertThat(response.status).isIn(CreateConnectorStatusDto.OK, CreateConnectorStatusDto.WARNING)
        assertConnector(response.id, ConnectorType.OWN)
    }

    @Test
    @TestTransaction
    fun testCreateProvidedConnector() {
        // arrange
        val clientIdUtilsMock = mock(ClientIdUtils::class.java)
        doReturn(test).`when`(clientIdUtilsMock).generateFromCertificate(eq(connectorCertificate))

        val dapsClient = mock(DapsClient::class.java)
        val dapsClientService = mock(DapsClientService::class.java)
        `when`(dapsClientService.forEnvironment(eq(test))).thenReturn(dapsClient)

        val brokerClient = mock(BrokerClient::class.java)
        val brokerClientService = mock(BrokerClientService::class.java)
        `when`(brokerClientService.forEnvironment(eq(test))).thenReturn(brokerClient)
        doNothing().`when`(brokerClient).addConnector(any())

        QuarkusMock.installMockForType(clientIdUtilsMock, ClientIdUtils::class.java)
        QuarkusMock.installMockForType(brokerClientService, BrokerClientService::class.java)
        QuarkusMock.installMockForType(dapsClientService, DapsClientService::class.java)
        val connectorRequest = CreateConnectorRequest(connectorName, connectorLocation, connectorFrontendUrl, connectorEndpointUrl, connectorManagementUrl, connectorCertificate)

        // act
        val response = connectorManagementApiService.createProvidedConnector(connectorRequest, otherMdsId, otherMdsId, userId, test)

        // assert
        verify(clientIdUtilsMock).generateFromCertificate(eq(connectorCertificate))
        verify(brokerClientService).forEnvironment(eq(test))
        verify(brokerClient).addConnector(any())
        verify(dapsClientService).forEnvironment(eq(test))
        assertThat(response.status).isIn(CreateConnectorStatusDto.OK, CreateConnectorStatusDto.WARNING)
        assertConnector(response.id, ConnectorType.PROVIDED)
    }

    @Test
    @TestTransaction
    fun testDeleteOwnConnector() {
        // arrange
        val connectorEndpointUrl = "https://xample.test4/connector/api/dsp"
        val dapsClient = mock(DapsClient::class.java)
        val dapsClientService = mock(DapsClientService::class.java)
        `when`(dapsClientService.forEnvironment(eq(test))).thenReturn(dapsClient)
        doNothing().`when`(dapsClient).deleteClient(anyString())

        val brokerClient = mock(BrokerClient::class.java)
        val brokerClientService = mock(BrokerClientService::class.java)
        `when`(brokerClientService.forEnvironment(eq(test))).thenReturn(brokerClient)
        doNothing().`when`(brokerClient).removeConnector(eq(connectorEndpointUrl))

        QuarkusMock.installMockForType(brokerClientService, BrokerClientService::class.java)
        QuarkusMock.installMockForType(dapsClientService, DapsClientService::class.java)
        val connectorId = "MDSL1111AA.CP59I8U"

        // act
        val response = connectorManagementApiService.deleteSelfHostedConnector(connectorId, otherMdsId, userId)

        // assert
        assertThat(response.id).isNotNull()
        assertThatThrownBy { connectorService.getConnectorOrThrow(response.id) }
            .isInstanceOf(java.lang.IllegalStateException::class.java)
        verify(dapsClientService).forEnvironment(eq(test))
        verify(brokerClientService).forEnvironment(test)
        verify(dapsClient).deleteClient(anyString())
        verify(brokerClient).removeConnector(eq(connectorEndpointUrl))
    }

    @Test
    @TestTransaction
    fun testUrlValidation() {
        // arrange
        val connectorRequest = CreateConnectorRequest(connectorName, connectorLocation, "invalid.url", connectorEndpointUrl, connectorManagementUrl, connectorCertificate)

        // act
        val response = connectorManagementApiService.createOwnConnector(connectorRequest, otherMdsId, userId)

        // assert
        assertThat(response.status).isEqualTo(CreateConnectorStatusDto.ERROR)
        assertThat(response.id).isBlank()
    }

    private fun assertConnector(id: String, connectorType: ConnectorType) {
        val connector = connectorService.getConnectorOrThrow(id)
        assertThat(id).isNotNull()
        assertThat(connector).isNotNull()
        assertThat(connector.mdsId).isEqualTo(otherMdsId)
        assertThat(connector.providerMdsId).isEqualTo(otherMdsId)
        assertThat(connector.environment).isEqualTo(test)
        assertThat(connector.clientId).isEqualTo(test)
        assertThat(connector.createdBy).isEqualTo(userId)
        assertThat(connector.type).isEqualTo(connectorType)
        assertThat(connector.name).isEqualTo(connectorName)
        assertThat(connector.location).isEqualTo(connectorLocation)
        assertThat(connector.frontendUrl).isEqualTo(connectorFrontendUrl)
        assertThat(connector.endpointUrl).isEqualTo(connectorEndpointUrl)
        assertThat(connector.managementUrl).isEqualTo(connectorManagementUrl)
    }
}
