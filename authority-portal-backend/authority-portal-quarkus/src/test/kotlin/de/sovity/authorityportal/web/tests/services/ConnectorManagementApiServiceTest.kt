package de.sovity.authorityportal.web.tests.services

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevConnectorId
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.tests.useDevUser
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class ConnectorManagementApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

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
}
