package de.sovity.authorityportal.web.integration.pages.usermanagement

import de.sovity.authorityportal.api.model.UpdateUserDto
import de.sovity.authorityportal.web.integration.pages.TestData
import de.sovity.authorityportal.web.integration.pages.TestData.USER_FIRST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_LAST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_PHONE_NUMBER
import de.sovity.authorityportal.web.integration.pages.TestData.USER_POSITION
import de.sovity.authorityportal.web.pages.usermanagement.UserUpdateApiService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserUpdateApiServiceTest {

    private val userId = "00000000-0000-0000-0000-00000001"

    @Inject
    lateinit var userUpdateApiService: UserUpdateApiService

    @Inject
    lateinit var userService: UserService

    lateinit var keycloakService: KeycloakService

    @BeforeEach
    fun before() {
        keycloakService = Mockito.mock(KeycloakService::class.java)
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)
    }

    @Test
    fun testUpdateUser() {
        // arrange
        val updateUserDto = UpdateUserDto(USER_FIRST_NAME, USER_LAST_NAME, USER_POSITION, USER_PHONE_NUMBER)

        // act
        val result = userUpdateApiService.updateUserDetails(userId, UpdateUserDto(USER_FIRST_NAME, USER_LAST_NAME,
            USER_POSITION, USER_PHONE_NUMBER))
        val user = userService.getUserOrThrow(userId)

        // assert
        assertThat(result.id).isNotNull()
        assertThat(user.firstName).isEqualTo(USER_FIRST_NAME)
        assertThat(user.lastName).isEqualTo(USER_LAST_NAME)
        assertThat(user.jobTitle).isEqualTo(USER_POSITION)
        assertThat(user.phone).isEqualTo(USER_PHONE_NUMBER)
    }
}
