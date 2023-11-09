package de.sovity.authorityportal.web.integration.pages.usermanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.pages.usermanagement.UserDeactivationApiService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserDeactivationApiServiceTest {

    @Inject
    lateinit var userDeactivationApiService: UserDeactivationApiService
    @Inject
    lateinit var userService: UserService

    @Test
    fun shouldDeactivateUser() {
        // arrange
        val userId = "00000000-0000-0000-0000-00000008"
        val keycloakService = mock(KeycloakService::class.java)
        doNothing().`when`(keycloakService).deactivateUser(eq(userId))
        doNothing().`when`(keycloakService).forceLogout(eq(userId))
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        // act
        val result = userDeactivationApiService.deactivateUser(userId, userId)

        // assert
        assertUser(result, UserRegistrationStatus.DEACTIVATED)
        verify(keycloakService).deactivateUser(eq(userId))
        verify(keycloakService).forceLogout(eq(userId))
    }

    @Test
    fun shouldReactivateUser() {
        // arrange
        val userId = "00000000-0000-0000-0000-00000009"
        val keycloakService = mock(KeycloakService::class.java)
        doNothing().`when`(keycloakService).reactivateUser(eq(userId))
        doNothing().`when`(keycloakService).forceLogout(eq(userId))
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        // act
        val result = userDeactivationApiService.reactivateUser(userId, userId)

        // assert
        assertUser(result, UserRegistrationStatus.ACTIVE)
        verify(keycloakService).reactivateUser(eq(userId))
        verify(keycloakService).forceLogout(eq(userId))
    }

    private fun assertUser(result: IdResponse, userRegistrationStatus: UserRegistrationStatus) {
        val user = userService.getUserOrThrow(result.id)
        assertThat(result.id).isNotNull()
        assertThat(user.registrationStatus).isEqualTo(userRegistrationStatus)
    }
}
