package de.sovity.authorityportal.web.tests.services.user

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
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
class UserRegistrationApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Test
    @TestTransaction
    fun `userRegistrationStatus returns actual status`() {
        // arrange
        ScenarioData().apply {
            user(0, null) { it.registrationStatus = UserRegistrationStatus.ACTIVE }
            user(1, null) { it.registrationStatus = UserRegistrationStatus.PENDING }
            scenarioInstaller.install(this)
        }

        // act
        useDevUser(0, null, emptySet())
        val resultActive = uiResource.userRegistrationStatus()

        useDevUser(1, null, emptySet())
        val resultPending = uiResource.userRegistrationStatus()

        // assert
        assertThat(resultActive.registrationStatus).isEqualTo(UserRegistrationStatusDto.ACTIVE)
        assertThat(resultPending.registrationStatus).isEqualTo(UserRegistrationStatusDto.PENDING)
    }
}
