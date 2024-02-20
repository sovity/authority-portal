package de.sovity.authorityportal.web.integration.pages.usermanagement

import de.sovity.authorityportal.api.model.UserAuthenticationStatusDto
import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.auth.LoggedInUser
import de.sovity.authorityportal.web.integration.pages.TestData.USER_EMAIL
import de.sovity.authorityportal.web.integration.pages.TestData.USER_FIRST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_LAST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_PHONE_NUMBER
import de.sovity.authorityportal.web.integration.pages.TestData.USER_POSITION
import de.sovity.authorityportal.web.pages.usermanagement.UserInfoApiService
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
import org.mockito.Mockito.never
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserInfoApiServiceTest {

    @Inject
    lateinit var userInfoApiService: UserInfoApiService

    lateinit var keycloakService: KeycloakService

    val userId = "00000000-0000-0000-0000-000000000001";


    @BeforeEach
    fun before() {
        keycloakService = Mockito.mock(KeycloakService::class.java)
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)
    }

    @Test
    fun testAuthenticatedUserInfo() {
        // arrange
        val mdsId = "MDSL1111AA";

        val loggedInUser = LoggedInUser(
            authenticated = true,
            userId = userId,
            organizationMdsId = mdsId,
            roles = setOf(Roles.UserRoles.PARTICIPANT_ADMIN)
        )

        val user = KeycloakUserDto(userId, USER_FIRST_NAME, USER_LAST_NAME, USER_EMAIL, USER_POSITION, USER_PHONE_NUMBER)
        `when`(keycloakService.getUser(eq(userId))).thenReturn(user)
        `when`(keycloakService.getUserRoles(eq(userId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))

        // act
        val result = userInfoApiService.userInfo(loggedInUser)

        // assert
        assertThat(result.authenticationStatus).isEqualTo(UserAuthenticationStatusDto.AUTHENTICATED)
        assertThat(result.userId).isEqualTo(userId)
        assertThat(result.firstName).isEqualTo(USER_FIRST_NAME)
        assertThat(result.lastName).isEqualTo(USER_LAST_NAME)
        assertThat(result.organizationName).isEqualTo("Dev Organization 1")
        assertThat(result.organizationMdsId).isEqualTo(mdsId)
        assertThat(result.roles).containsExactly(UserRoleDto.PARTICIPANT_ADMIN)
        assertThat(result.registrationStatus).isEqualTo(UserRegistrationStatusDto.ACTIVE)

        // verify
        verify(keycloakService).getUser(eq(userId))
        verify(keycloakService).getUserRoles(eq(userId))
    }

    @Test
    fun testUnauthenticatedUserInfo() {
        // arrange
        val mdsId = "MDSL1111AA";

        val loggedInUser = LoggedInUser(
            authenticated = false,
            userId = "",
            organizationMdsId = null,
            roles = setOf("UNAUTHENTICATED")
        )

        // act
        val result = userInfoApiService.userInfo(loggedInUser)

        // assert
        assertThat(result.authenticationStatus).isEqualTo(UserAuthenticationStatusDto.UNAUTHENTICATED)
        assertThat(result.userId).isEqualTo("unauthenticated")
        assertThat(result.firstName).isEqualTo("Unknown")
        assertThat(result.lastName).isEqualTo("User")
        assertThat(result.organizationName).isEqualTo("No Organization")
        assertThat(result.organizationMdsId).isEqualTo("unauthenticated")
        assertThat(result.roles).containsExactly(UserRoleDto.UNAUTHENTICATED)
        assertThat(result.registrationStatus).isNull()

        // verify
        verify(keycloakService, never()).getUser(any())
        verify(keycloakService, never()).getUserRoles(any())
    }

    @Test
    fun testUserDetails() {
        // arrange
        val user = KeycloakUserDto(userId, USER_FIRST_NAME, USER_LAST_NAME, USER_EMAIL, USER_POSITION, USER_PHONE_NUMBER)
        `when`(keycloakService.getUser(eq(userId))).thenReturn(user)
        `when`(keycloakService.getUserRoles(eq(userId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))

        // act
        val result = userInfoApiService.userDetails(userId)

        // assert
        assertThat(result.firstName).isEqualTo(USER_FIRST_NAME)
        assertThat(result.lastName).isEqualTo(USER_LAST_NAME)
        assertThat(result.email).isEqualTo(USER_EMAIL)
        assertThat(result.roles).containsExactly(UserRoleDto.PARTICIPANT_USER)
        assertThat(result.registrationStatus).isEqualTo(UserRegistrationStatusDto.ACTIVE)
        assertThat(result.creationDate).isNotNull()

        // verify
        verify(keycloakService).getUser(eq(userId))
        verify(keycloakService).getUserRoles(eq(userId))
    }
}
