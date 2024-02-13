package de.sovity.authorityportal.web.integration.pages.connectormanagement

import de.sovity.authorityportal.api.model.CreateCaasRequest
import de.sovity.authorityportal.api.model.CreateConnectorStatusDto
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.web.pages.connectormanagement.CaasManagementApiService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.thirdparty.caas.CaasClient
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasDetails
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasPortalResponse
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions
import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.assertj.core.data.TemporalUnitWithinOffset
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import java.time.OffsetDateTime
import java.time.temporal.ChronoUnit

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class CaasManagementApiServiceTest {

    @Inject
    lateinit var caasManagementApiService: CaasManagementApiService

    @Inject
    lateinit var connectorService: ConnectorService

    lateinit var caasClient: CaasClient

    private val mdsId = "MDSL1111AA"
    private val userId = "00000000-0000-0000-0000-000000000001"
    private val caasRequest = CreateCaasRequest(
        "sovity.caas.subdomain",
        "Test CaaS",
        "Connector-as-a-service for testing purposes"
    )

    @BeforeEach
    fun setup() {
        caasClient = Mockito.mock(CaasClient::class.java)
        QuarkusMock.installMockForType(caasClient, CaasClient::class.java)
    }

    @Test
    fun testCreateCaas() {
        // arrange
        val curatorOrganization = OrganizationRecord()
        curatorOrganization.name = "Test Organization"
        curatorOrganization.url = "https://test.example.com"

        `when`(caasClient.validateSubdomain(Mockito.anyString())).thenReturn(true)
        `when`(caasClient.requestCaas(any())).thenReturn(CaasPortalResponse().apply {
            value = CaasDetails(
                connectorId = "testId"
            )
        })

        // act
        val result = caasManagementApiService.createCaas(mdsId, userId, caasRequest, "test")

        // assert
        assertThat(result).isNotNull
        assertThat(result.id).isNotNull
        assertThat(result.status).isEqualTo(CreateConnectorStatusDto.OK)

        val caas = connectorService.getCaas(result.id)
        Assertions.assertThat(caas).isNotNull()
        caas!!

        assertThat(caas.connectorId).isEqualTo(result.id)
        assertThat(caas.createdAt).isCloseTo(OffsetDateTime.now(), TemporalUnitWithinOffset(1, ChronoUnit.SECONDS))
        assertThat(caas.createdBy).isEqualTo(userId)
        assertThat(caas.mdsId).isEqualTo(mdsId)
        assertThat(caas.name).isEqualTo(caasRequest.connectorTitle)
    }
}
