package de.sovity.authorityportal.web.tests.services

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevConnectorId
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.tests.useDevUser
import de.sovity.authorityportal.web.thirdparty.daps.DapsClient
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class ConnectorManagementApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Inject
    lateinit var dsl: DSLContext

    @InjectMock
    lateinit var dapsClientService: DapsClientService

    @Test
    @TestTransaction
    fun `get connector details as authority user`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0) {
                it.name = "Connector 0"
            }
            connector(1, 0, 0)
            connector(2, 0, 0)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getConnector("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")

        // assert
        assertThat(result.connectorId).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")
        assertThat(result.connectorName).isEqualTo("Connector 0")
        assertThat(result.orgMdsId).isEqualTo(dummyDevMdsId(0))
    }

    @Test
    @TestTransaction
    fun `get connector details as operator admin`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.OPERATOR_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0) {
                it.name = "Connector 0"
            }
            connector(1, 0, 0)
            connector(2, 0, 0)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getConnector("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")

        // assert
        assertThat(result.connectorId).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")
        assertThat(result.connectorName).isEqualTo("Connector 0")
        assertThat(result.orgMdsId).isEqualTo(dummyDevMdsId(0))
    }

    @Test
    @TestTransaction
    fun `get all connectors as authority user for environment test shows only connectors from that env`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0)
            connector(1, 0, 0)

            connector(2, 0, 0) {
                it.environment = "other-environment"
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getAllConnectors("test")

        // assert
        assertThat(result.connectors).hasSize(2)
        assertThat(result.connectors).noneMatch { it.environment.environmentId != "test" }
        assertThat(result.connectors).noneMatch { it.id == "${dummyDevMdsId(0)}.${dummyDevConnectorId(2)}" }

        assertThat(result.connectors[0].id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")
        assertThat(result.connectors[1].id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(1)}")
    }

    @Test
    @TestTransaction
    fun `get all connectors as operator admin for different environment shows only connectors from that env`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.OPERATOR_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0)
            connector(1, 0, 0)

            connector(2, 0, 0) {
                it.environment = "other-environment"
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getAllConnectors("other-environment")

        // assert
        assertThat(result.connectors).hasSize(1)
        assertThat(result.connectors).noneMatch { it.environment.environmentId != "other-environment" }
        assertThat(result.connectors).noneMatch { it.id == "${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}" }
        assertThat(result.connectors).noneMatch { it.id == "${dummyDevMdsId(0)}.${dummyDevConnectorId(1)}" }

        assertThat(result.connectors[0].id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(2)}")
        assertThat(result.connectors[0].environment.environmentId).isEqualTo("other-environment")
    }

    @Test
    @TestTransaction
    fun `get provided connectors returns all connectors where user mdsId is host but not owner`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            organization(1, 1)
            user(1, 1)

            connector(1, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
            }
            connector(2, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getProvidedConnectors("test")

        // assert
        assertThat(result.connectors).hasSize(2)
        assertThat(result.connectors).noneMatch { it.environment.environmentId != "test" }
        assertThat(result.connectors).noneMatch { it.id == "${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}" }

        assertThat(result.connectors[0].id).isEqualTo("${dummyDevMdsId(1)}.${dummyDevConnectorId(1)}")
        assertThat(result.connectors[1].id).isEqualTo("${dummyDevMdsId(1)}.${dummyDevConnectorId(2)}")
    }

    @Test
    @TestTransaction
    fun `get provided connector details with valid provided connectorId`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            organization(1, 1)
            user(1, 1)

            connector(1, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
                it.name = "Connector 1"
            }
            connector(2, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
                it.name = "Connector 2"
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getProvidedConnectorDetails("${dummyDevMdsId(1)}.${dummyDevConnectorId(1)}")

        // assert
        assertThat(result.connectorId).isEqualTo("${dummyDevMdsId(1)}.${dummyDevConnectorId(1)}")
        assertThat(result.connectorName).isEqualTo("Connector 1")
        assertThat(result.orgMdsId).isEqualTo(dummyDevMdsId(1))
        assertThat(result.hostMdsId).isEqualTo(dummyDevMdsId(0))
        assertThat(result.hostName).isEqualTo("Organization 0")
    }

    @Test
    @TestTransaction
    fun `get provided connector details with connectorId not hosted by user org`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            organization(1, 1)
            user(1, 1)

            connector(1, 1, 0) {
                it.providerMdsId = dummyDevMdsId(1)
                it.name = "Connector 1"
            }
            connector(2, 1, 0) {
                it.providerMdsId = dummyDevMdsId(1)
                it.name = "Connector 2"
            }

            scenarioInstaller.install(this)
        }

        // act & assert
        assertThatThrownBy {
            uiResource.getProvidedConnectorDetails("${dummyDevMdsId(1)}.${dummyDevConnectorId(1)}")
        }.isInstanceOf(IllegalStateException::class.java)
            .hasMessageContaining("Connector ID does not match with organization or host organization")
    }

    @Test
    @TestTransaction
    fun `delete self-hosted connector`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_CURATOR))

        val dapsClient = mock<DapsClient>()
        whenever(dapsClientService.forEnvironment(any())).thenReturn(dapsClient)
        doNothing().whenever(dapsClient).deleteClient(any())

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.deleteOwnConnector("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")

        // assert
        val connectorCountQuery = dsl.selectCount()
            .from(Tables.CONNECTOR)
            .where(Tables.CONNECTOR.CONNECTOR_ID.eq("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}"))
            .fetchOne(0, Int::class.java)

        assertThat(result).isNotNull
        assertThat(result.id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")
        assertThat(connectorCountQuery).isEqualTo(0)
    }

    @Test
    @TestTransaction
    fun `delete provided connector`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        val dapsClient = mock<DapsClient>()
        whenever(dapsClientService.forEnvironment(any())).thenReturn(dapsClient)
        doNothing().whenever(dapsClient).deleteClient(any())

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            organization(1, 1)
            user(1, 1)
            connector(0, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.deleteProvidedConnector("${dummyDevMdsId(1)}.${dummyDevConnectorId(0)}")

        // assert
        val connectorCountQuery = dsl.selectCount()
            .from(Tables.CONNECTOR)
            .where(Tables.CONNECTOR.CONNECTOR_ID.eq("${dummyDevMdsId(1)}.${dummyDevConnectorId(0)}"))
            .fetchOne(0, Int::class.java)

        assertThat(result).isNotNull
        assertThat(result.id).isEqualTo("${dummyDevMdsId(1)}.${dummyDevConnectorId(0)}")
        assertThat(connectorCountQuery).isEqualTo(0)
    }
}
