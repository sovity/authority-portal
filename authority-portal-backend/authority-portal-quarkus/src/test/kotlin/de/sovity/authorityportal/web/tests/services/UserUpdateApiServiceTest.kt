package de.sovity.authorityportal.web.tests.services

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.OnboardingUserUpdateDto
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevUserUuid
import de.sovity.authorityportal.web.tests.useDevUser
import de.sovity.authorityportal.web.tests.useMockNow
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import jakarta.ws.rs.NotAuthorizedException
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.whenever
import java.time.OffsetDateTime

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserUpdateApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Inject
    lateinit var dsl: DSLContext

    @InjectMock
    lateinit var keycloakService: KeycloakService

    @Test
    @TestTransaction
    fun `update onboarding user fails because user is not in onboarding state`() {
        // arrange
        useDevUser(0, 0)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0) {
                it.registrationStatus = UserRegistrationStatus.ACTIVE
            }
            scenarioInstaller.install(this)
        }

        val request = OnboardingUserUpdateDto(
            firstName = "Max",
            lastName = "Mustermann",
            jobTitle = "Analyst",
            phoneNumber = "+49 123456789"
        )

        // act & assert
        assertThatThrownBy {
            uiResource.updateOnboardingUser(request)
        }.isInstanceOf(NotAuthorizedException::class.java)
    }

    @Test
    @TestTransaction
    fun `update onboarding user changes the user data appropriately`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0)
        useMockNow(now)

        doNothing().whenever(keycloakService).updateUser(any(), any(), any(), any())

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0) {
                it.firstName = "Test"
                it.lastName = "User"
                it.phone = null
                it.jobTitle = null
                it.registrationStatus = UserRegistrationStatus.ONBOARDING
                it.createdAt = now
            }
            scenarioInstaller.install(this)
        }

        val request = OnboardingUserUpdateDto(
            firstName = "Max",
            lastName = "Mustermann",
            jobTitle = "Analyst",
            phoneNumber = "+49 123456789"
        )

        // act
        val result = uiResource.updateOnboardingUser(request)

        // assert
        assertThat(result).isNotNull
        assertThat(result.id).isEqualTo(dummyDevUserUuid(0))

        val actual = dsl.selectFrom(Tables.USER).where(Tables.USER.ID.eq(dummyDevUserUuid(0))).fetchOne()
        assertThat(actual).isNotNull
        assertThat(actual!!.firstName).isEqualTo("Max")
        assertThat(actual.lastName).isEqualTo("Mustermann")
        assertThat(actual.phone).isEqualTo("+49 123456789")
        assertThat(actual.jobTitle).isEqualTo("Analyst")
        assertThat(actual.registrationStatus).isEqualTo(UserRegistrationStatus.ACTIVE)
    }
}
