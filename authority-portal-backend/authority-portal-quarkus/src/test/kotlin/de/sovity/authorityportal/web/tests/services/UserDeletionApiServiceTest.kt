package de.sovity.authorityportal.web.tests.services

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.PossibleCreatorSuccessor
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.seeds.utils.dummyDevUserUuid
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.tests.useDevUser
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import jakarta.ws.rs.NotAuthorizedException
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.mockito.kotlin.eq
import org.mockito.kotlin.whenever

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserDeletionApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @InjectMock
    lateinit var keycloakService: KeycloakService

    @Test
    fun `checkUserDeletion fails because user is not admin and target is not self`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_USER))

        // act & assert
        assertThatThrownBy {
            uiResource.checkUserDeletion(dummyDevUserUuid(1))
        }.isInstanceOf(NotAuthorizedException::class.java)
    }

    @Test
    @TestTransaction
    fun `checkUserDeletion fails because user is not authority and target is in different organization`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            organization(1, 1)
            user(0, 0)
            user(1, 1)
            scenarioInstaller.install(this)
        }

        // act & assert
        assertThatThrownBy {
            uiResource.checkUserDeletion(dummyDevUserUuid(1))
        }.isInstanceOf(NotAuthorizedException::class.java)
    }

    @Test
    @TestTransaction
    fun `checkUserDeletion as last participant admin and organization creator`() {
        // arrange
        val lastParticipantAdmin = KeycloakUserDto(dummyDevUserUuid(0), "Test", "User", "test.user@test.sovity.io")
        val lastAuthorityUser = KeycloakUserDto(dummyDevUserUuid(99), "Authority", "User", "authority@test.sovity.io")

        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_ADMIN))

        whenever(keycloakService.getAuthorityAdmins()).thenReturn(listOf(lastAuthorityUser))
        whenever(keycloakService.getParticipantAdmins(eq(dummyDevMdsId(0)))).thenReturn(listOf(lastParticipantAdmin))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            user(1, 0)
            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.checkUserDeletion(dummyDevUserUuid(0))

        // assert
        assertThat(result).isNotNull
        assertThat(result.userId).isEqualTo(dummyDevUserUuid(0))
        assertThat(result.canBeDeleted).isTrue()
        assertThat(result.isLastParticipantAdmin).isTrue()
        assertThat(result.isOrganizationCreator).isTrue()
        assertThat(result.possibleCreatorSuccessors.size).isEqualTo(0)
    }

    @Test
    @TestTransaction
    fun `checkUserDeletion as organization creator with possible successor`() {
        // arrange
        val keycloakUser = KeycloakUserDto(dummyDevUserUuid(0), "Test", "User", "test.user@test.sovity.io")
        val possibleSuccessor = KeycloakUserDto(dummyDevUserUuid(1), "Max", "Mustermann", "max.mustermann@test.sovity.io")
        val lastAuthorityUser = KeycloakUserDto(dummyDevUserUuid(99), "Authority", "User", "authority@test.sovity.io")

        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_ADMIN))

        whenever(keycloakService.getAuthorityAdmins()).thenReturn(listOf(lastAuthorityUser))
        whenever(keycloakService.getParticipantAdmins(eq(dummyDevMdsId(0)))).thenReturn(listOf(keycloakUser, possibleSuccessor))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            user(1, 0) {
                it.firstName = "Max"
                it.lastName = "Mustermann"
                it.email = "max.mustermann@test.sovity.io"
            }
            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.checkUserDeletion(dummyDevUserUuid(0))

        // assert
        assertThat(result).isNotNull
        assertThat(result.userId).isEqualTo(dummyDevUserUuid(0))
        assertThat(result.canBeDeleted).isTrue()
        assertThat(result.isLastParticipantAdmin).isFalse()
        assertThat(result.isOrganizationCreator).isTrue()
        assertThat(result.possibleCreatorSuccessors.size).isEqualTo(1)

        val expectedSuccessor = PossibleCreatorSuccessor(
            userId = dummyDevUserUuid(1),
            firstName = "Max",
            lastName = "Mustermann"
        )

        assertThat(result.possibleCreatorSuccessors).containsExactly(expectedSuccessor)
    }
}
