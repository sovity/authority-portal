package de.sovity.authorityportal.web.integration.pages.usermanagement

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.Roles
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
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserInfoApiServiceTest {

    @Inject
    lateinit var userInfoApiService: UserInfoApiService

    lateinit var keycloakService: KeycloakService

    val userId = "9525c6ea-34d5-4c11-b9f8-133dc2086f00"


    @BeforeEach
    fun before() {
        val user = KeycloakUserDto(userId, USER_FIRST_NAME, USER_LAST_NAME, USER_EMAIL, USER_POSITION, USER_PHONE_NUMBER)
        keycloakService = Mockito.mock(KeycloakService::class.java)
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        `when`(keycloakService.getUserRoles(eq(userId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))
    }

    @Test
    fun testUserInfo() {
        // arrange
        val mdsId = "MDSL1111AA"

        // act
        val result = userInfoApiService.userInfo(userId, mdsId, setOf(Roles.UserRoles.PARTICIPANT_ADMIN))

        // assert
        assertThat(result.userId).isEqualTo(userId)
        assertThat(result.firstName).isEqualTo(USER_FIRST_NAME)
        assertThat(result.lastName).isEqualTo(USER_LAST_NAME)
        assertThat(result.organizationName).isEqualTo("Dev Organization 1")
        assertThat(result.organizationMdsId).isEqualTo(mdsId)
        assertThat(result.roles).containsExactly(UserRoleDto.PARTICIPANT_ADMIN)
        assertThat(result.registrationStatus).isEqualTo(UserRegistrationStatusDto.ACTIVE)

        // verify
        verify(keycloakService).getUserRoles(eq(userId))
    }

    @Test
    fun testUserDetails() {
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
        verify(keycloakService).getUserRoles(eq(userId))
    }
}
