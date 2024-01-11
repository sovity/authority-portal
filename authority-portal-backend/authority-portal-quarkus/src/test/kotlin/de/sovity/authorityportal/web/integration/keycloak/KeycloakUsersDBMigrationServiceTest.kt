package de.sovity.authorityportal.web.integration.keycloak

import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakUsersDBMigrationService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.verify

@QuarkusTest
class KeycloakUsersDBMigrationServiceTest {

    @Inject
    lateinit var keycloakUsersDBMigrationService: KeycloakUsersDBMigrationService
    @Inject
    lateinit var userService: UserService

    object User1 {
        const val id = "test-id-1"
        const val firstName = "John"
        const val lastName = "Doe"
        const val email = "one@example.test"
        const val position = "Software Engineer"
        const val phoneNumber = "+1234567890"
        const val mdsId = "MDSL1111AA"
    }

    object User2 {
        const val id = "test-id-2"
        const val firstName = "Jane"
        const val lastName = "Doe"
        const val email = "two@example.test"
        const val position = "UI/UX Designer"
        const val phoneNumber = "+987654321"
        const val mdsId = "MDSL2222BB"
    }

    object User3 {
        const val id = "test-id-3"
        const val firstName = "Nathan"
        const val lastName = "Register"
        const val email = "three@example.test"
        const val position = "HR Lead"
        const val phoneNumber = "+551231235"
        const val mdsId = "MDSL3333CC"
    }

    @BeforeEach
    fun setup() {
        userService.dsl.deleteFrom(de.sovity.authorityportal.db.jooq.Tables.USER).where(de.sovity.authorityportal.db.jooq.Tables.USER.ID.eq(User1.id)).execute()
        userService.dsl.deleteFrom(de.sovity.authorityportal.db.jooq.Tables.USER).where(de.sovity.authorityportal.db.jooq.Tables.USER.ID.eq(User2.id)).execute()
        userService.dsl.deleteFrom(de.sovity.authorityportal.db.jooq.Tables.USER).where(de.sovity.authorityportal.db.jooq.Tables.USER.ID.eq(User3.id)).execute()

        userService.registerUserWithDetails(
            User1.id,
            UserRegistrationStatus.ACTIVE,
            User1.email,
            User1.firstName,
            User1.lastName,
            User1.position,
            User1.phoneNumber,
            User1.mdsId
        )
        userService.registerUserWithDetails(
            User2.id,
            UserRegistrationStatus.ACTIVE,
            User2.email,
            User2.firstName,
            User2.lastName,
            User2.position,
            User2.phoneNumber,
            User2.mdsId
        )
    }

    @Test
    fun syncUsersFromKeycloakTest() {
        // arrange
        val keycloakService = Mockito.mock(KeycloakService::class.java)
        val keycloakUserDto1 = KeycloakUserDto(
            User1.id,
            User1.firstName,
            User1.lastName,
            User1.email,
            User1.position,
            User1.phoneNumber
        )
        val keycloakUserDto2 = KeycloakUserDto(
            User2.id,
            User2.firstName,
            User2.lastName,
            User2.email,
            User2.position,
            User2.phoneNumber
        )
        val keycloakUserDto3 = KeycloakUserDto(
            User3.id,
            User3.firstName,
            User3.lastName,
            User3.email,
            User3.position,
            User3.phoneNumber
        )

        val userCountBefore = userService.getUsers().size
        doReturn(listOf(keycloakUserDto1, keycloakUserDto2, keycloakUserDto3)).`when`(keycloakService).getUsers()
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        // act

        keycloakUsersDBMigrationService.syncUsersFromKeycloak()
        val users = userService.getUsers()

        // assert
        assertThat(users.size).isEqualTo(userCountBefore + 1)
        assertThat(users.stream().anyMatch { it.id == User3.id }).isTrue
    }

    @Test
    fun syncUsersToKeycloakTest() {
        // arrange
        val keycloakService = Mockito.mock(KeycloakService::class.java)
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        // act
        keycloakUsersDBMigrationService.syncUsersToKeycloak()

        // assert
        verify(keycloakService).updateUser(User1.id, User1.firstName, User1.lastName)
        verify(keycloakService).updateUser(User2.id, User2.firstName, User2.lastName)
    }
}
