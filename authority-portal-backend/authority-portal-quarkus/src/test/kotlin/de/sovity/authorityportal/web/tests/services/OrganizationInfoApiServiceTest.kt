package de.sovity.authorityportal.web.tests.services

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
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
class OrganizationInfoApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Test
    @TestTransaction
    fun `organization overview for authority users`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            connector(1, 0, 0)
            connector(2, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(3, 1, 1)

            organization(2, 2)
            user(2, 2)
            user(3, 2)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.organizationsOverviewForAuthority("test")

        // assert
        assertThat(result.organizations).hasSize(3)

        assertThat(result.organizations[0].mdsId).isEqualTo(dummyDevMdsId(0))
        assertThat(result.organizations[0].name).isEqualTo("Organization 0")
        assertThat(result.organizations[0].numberOfConnectors).isEqualTo(3)
        assertThat(result.organizations[0].numberOfUsers).isEqualTo(1)

        assertThat(result.organizations[1].mdsId).isEqualTo(dummyDevMdsId(1))
        assertThat(result.organizations[1].name).isEqualTo("Organization 1")
        assertThat(result.organizations[1].numberOfConnectors).isEqualTo(1)
        assertThat(result.organizations[1].numberOfUsers).isEqualTo(1)

        assertThat(result.organizations[2].mdsId).isEqualTo(dummyDevMdsId(2))
        assertThat(result.organizations[2].name).isEqualTo("Organization 2")
        assertThat(result.organizations[2].numberOfConnectors).isEqualTo(0)
        assertThat(result.organizations[2].numberOfUsers).isEqualTo(2)
    }

    @Test
    @TestTransaction
    fun `organization overview for service partner admins does not contain own organization`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            connector(1, 0, 0)
            connector(2, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(3, 1, 1)

            organization(2, 2)
            user(2, 2)
            user(3, 2)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.organizationsOverviewForProvidingConnectors("test")

        // assert
        assertThat(result.organizations).hasSize(2)

        assertThat(result.organizations).noneMatch { it.mdsId == dummyDevMdsId(0) }
        assertThat(result.organizations).noneMatch { it.name == "Organization 0"}

        assertThat(result.organizations[0].mdsId).isEqualTo(dummyDevMdsId(1))
        assertThat(result.organizations[0].name).isEqualTo("Organization 1")
        assertThat(result.organizations[0].numberOfConnectors).isEqualTo(1)
        assertThat(result.organizations[0].numberOfUsers).isEqualTo(1)

        assertThat(result.organizations[1].mdsId).isEqualTo(dummyDevMdsId(2))
        assertThat(result.organizations[1].name).isEqualTo("Organization 2")
        assertThat(result.organizations[1].numberOfConnectors).isEqualTo(0)
        assertThat(result.organizations[1].numberOfUsers).isEqualTo(2)
    }

    @Test
    @TestTransaction
    fun `organization overview for authority users in different environment does not return connectors from test env`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            connector(1, 0, 0)
            connector(2, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(3, 1, 1)

            organization(2, 2)
            user(2, 2)
            user(3, 2)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.organizationsOverviewForAuthority("other-environment")

        // assert
        assertThat(result.organizations).hasSize(3)

        assertThat(result.organizations[0].mdsId).isEqualTo(dummyDevMdsId(0))
        assertThat(result.organizations[0].name).isEqualTo("Organization 0")
        assertThat(result.organizations[0].numberOfConnectors).isEqualTo(0)
        assertThat(result.organizations[0].numberOfUsers).isEqualTo(1)

        assertThat(result.organizations[1].mdsId).isEqualTo(dummyDevMdsId(1))
        assertThat(result.organizations[1].name).isEqualTo("Organization 1")
        assertThat(result.organizations[1].numberOfConnectors).isEqualTo(0)
        assertThat(result.organizations[1].numberOfUsers).isEqualTo(1)

        assertThat(result.organizations[2].mdsId).isEqualTo(dummyDevMdsId(2))
        assertThat(result.organizations[2].name).isEqualTo("Organization 2")
        assertThat(result.organizations[2].numberOfConnectors).isEqualTo(0)
        assertThat(result.organizations[2].numberOfUsers).isEqualTo(2)
    }
}
