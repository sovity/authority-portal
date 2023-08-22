package de.sovity.authorityportal.web.services.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class UserRegistrationApiServiceTest {
    @InjectMocks
    lateinit var userRegistrationApiService: UserRegistrationApiService

    @Mock
    lateinit var keycloakService: KeycloakService

    @Test
    fun testUserRegistrationStatus() {
        // arrange
        val userId = "123"
        val pendingUser = mock(KeycloakUserDto::class.java)
        `when`(pendingUser.registrationStatus).thenReturn(UserRegistrationStatus.PENDING)
        `when`(keycloakService.getUser(userId)).thenReturn(pendingUser)
        val expected = UserRegistrationStatusDto.PENDING

        // act
        val actual = userRegistrationApiService.userRegistrationStatus(userId)

        // assert
        assertThat(actual.registrationStatus).isEqualTo(expected)
    }

    @Test
    fun testUserRegistrationStatusUnknown() {

    }
}
