package de.sovity.authorityportal.web.integration.pages.connectormanagement

import de.sovity.authorityportal.api.model.ConnectorTypeDto
import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.api.model.CreateConnectorStatusDto
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.web.pages.connectormanagement.ConnectorManagementApiService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClient
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.daps.DapsClient
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.anyString
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class ConnectorManagementApiServiceTest {

    @Inject
    lateinit var connectorManagementApiService: ConnectorManagementApiService

    @Inject
    lateinit var connectorService: ConnectorService

    private val test = "test"
    private val connectorId = "MDSL2222BB.CP59I8U"
    private val mdsId = "MDSL1111AA"
    private val userId = "00000000-0000-0000-0000-000000000001"
    private val connectorName = "testName"
    private val connectorLocation = "testLocation"
    private val connectorFrontendUrl = "https://test.url"
    private val connectorEndpointUrl = "https://test.url/api/dsp"
    private val connectorManagementUrl = "https://test.url/api/management"
    private val connectorCertificate = "testCertificate"

    @BeforeEach
    fun init() {
        connectorService.dsl
            .deleteFrom(de.sovity.authorityportal.db.jooq.Tables.CONNECTOR)
            .where(de.sovity.authorityportal.db.jooq.Tables.CONNECTOR.CLIENT_ID.eq(test))
            .execute()
    }

    @Test
    fun testGetAllDeploymentEnvironment() {
        // act
        val result = connectorManagementApiService.getAllDeploymentEnvironment()

        // assert
        assertThat(result).hasSize(1)
        assertThat(result[0].environmentId).isEqualTo(test)
        assertThat(result[0].title).isEqualTo("Test Environment")
    }

    @Test
    fun testGetConnectorDetailsException() {
        assertThatThrownBy { connectorManagementApiService.getConnectorDetails("testConnectorId", "testMdsId", "testUserId") }
            .isInstanceOf(java.lang.IllegalStateException::class.java)
    }

    @Test
    fun testGetConnectorDetails() {
        // arrange
        val mdsId = "MDSL2222BB"

        // act
        val result = connectorManagementApiService.getConnectorDetails(connectorId, mdsId, userId)

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
    }

    @Test
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
    fun testListAllConnectors() {
        // act
        val result = connectorManagementApiService.listAllConnectors(test)

        // assert
        assertThat(result).isNotNull
        assertThat(result.connectors).hasSize(6)
        assertThat(result.connectors.map { it.id }).allSatisfy { assertThat(it).isNotNull() }
        assertThat(result.connectors.map { it.hostName }).anySatisfy { assertThat(it).isEqualTo("Dev Organization 1") }
        assertThat(result.connectors.map { it.hostName }).anySatisfy { assertThat(it).isEqualTo("Dev Organization 2") }
        assertThat(result.connectors.map { it.environment.environmentId }).allSatisfy { assertThat(it).isEqualTo("test") }
        assertThat(result.connectors.map { it.environment.title }).allSatisfy { assertThat(it).isEqualTo("Test Environment") }
        assertThat(result.connectors.map { it.name }).allSatisfy { assertThat(it).isNotBlank() }
    }

    @Test
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
        doNothing().`when`(brokerClient).addConnector(eq(connectorEndpointUrl))

        QuarkusMock.installMockForType(clientIdUtilsMock, ClientIdUtils::class.java)
        QuarkusMock.installMockForType(brokerClientService, BrokerClientService::class.java)
        QuarkusMock.installMockForType(dapsClientService, DapsClientService::class.java)
        val connectorRequest = CreateConnectorRequest(connectorName, connectorLocation, connectorFrontendUrl, connectorEndpointUrl, connectorManagementUrl, connectorCertificate)

        // act
        val response = connectorManagementApiService.createOwnConnector(connectorRequest, mdsId, userId)

        // assert
        verify(clientIdUtilsMock).generateFromCertificate(eq(connectorCertificate))
        verify(brokerClientService).forEnvironment(eq(test))
        verify(brokerClient).addConnector(eq(connectorEndpointUrl))
        verify(dapsClientService).forEnvironment(eq(test))
        assertThat(response.status).isIn(CreateConnectorStatusDto.OK, CreateConnectorStatusDto.WARNING)
        assertConnector(response.id, ConnectorType.OWN)
    }

    @Test
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
        doNothing().`when`(brokerClient).addConnector(eq(connectorEndpointUrl))

        QuarkusMock.installMockForType(clientIdUtilsMock, ClientIdUtils::class.java)
        QuarkusMock.installMockForType(brokerClientService, BrokerClientService::class.java)
        QuarkusMock.installMockForType(dapsClientService, DapsClientService::class.java)
        val connectorRequest = CreateConnectorRequest(connectorName, connectorLocation, connectorFrontendUrl, connectorEndpointUrl, connectorManagementUrl, connectorCertificate)

        // act
        val response = connectorManagementApiService.createProvidedConnector(connectorRequest, mdsId, mdsId, userId, test)

        // assert
        verify(clientIdUtilsMock).generateFromCertificate(eq(connectorCertificate))
        verify(brokerClientService).forEnvironment(eq(test))
        verify(brokerClient).addConnector(eq(connectorEndpointUrl))
        verify(dapsClientService).forEnvironment(eq(test))
        assertThat(response.status).isIn(CreateConnectorStatusDto.OK, CreateConnectorStatusDto.WARNING)
        assertConnector(response.id, ConnectorType.PROVIDED)
    }

    @Test
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
        val response = connectorManagementApiService.deleteOwnConnector(connectorId, mdsId, userId)

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
    fun testUrlValidation() {
        // arrange
        val connectorRequest = CreateConnectorRequest(connectorName, connectorLocation, "invalid.url", connectorEndpointUrl, connectorManagementUrl, connectorCertificate)

        // act
        val response = connectorManagementApiService.createOwnConnector(connectorRequest, mdsId, userId)

        // assert
        assertThat(response.status).isEqualTo(CreateConnectorStatusDto.ERROR)
        assertThat(response.id).isBlank()
    }

    private fun assertConnector(id: String, connectorType: ConnectorType) {
        val connector = connectorService.getConnectorOrThrow(id)
        assertThat(id).isNotNull()
        assertThat(connector).isNotNull()
        assertThat(connector.mdsId).isEqualTo(mdsId)
        assertThat(connector.providerMdsId).isEqualTo(mdsId)
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
