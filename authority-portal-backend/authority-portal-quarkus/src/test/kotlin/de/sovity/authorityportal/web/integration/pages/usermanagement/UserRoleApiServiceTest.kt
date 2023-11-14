package de.sovity.authorityportal.web.integration.pages.usermanagement

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.pages.usermanagement.UserRoleApiService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.ApplicationRole
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import io.quarkus.test.junit.QuarkusMock.installMockForType
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import jakarta.ws.rs.WebApplicationException
import jakarta.ws.rs.core.Response
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq
import org.mockito.kotlin.never
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserRoleApiServiceTest {

    @Inject
    lateinit var userRoleApiService: UserRoleApiService

    private val userId = "00000000-0000-0000-0000-00000001"
    private val mdsId = "MDSL1111AA"

    lateinit var keycloakService: KeycloakService

    @BeforeEach
    fun before() {
        keycloakService = mock(KeycloakService::class.java)
        installMockForType(keycloakService, KeycloakService::class.java)
    }

    @Test
    fun testChangeParticipantRole() {
        // arrange
        doNothing().`when`(keycloakService).forceLogout(eq(userId))
        doNothing().`when`(keycloakService).joinOrganization(eq(userId), eq(mdsId), eq(OrganizationRole.PARTICIPANT_ADMIN))

        // act
        val result = userRoleApiService.changeParticipantRole(userId, UserRoleDto.PARTICIPANT_ADMIN, mdsId, userId)

        // assert
        assertThat(result.id).isNotNull()

        // verify
        verify(keycloakService).joinOrganization(eq(userId), eq(mdsId), eq(OrganizationRole.PARTICIPANT_ADMIN))
        verify(keycloakService).forceLogout(eq(userId))
    }

    @Test
    fun testChangeAuthorityRole() {
        // arrange
        doNothing().`when`(keycloakService).forceLogout(eq(userId))
        doNothing().`when`(keycloakService).joinApplicationRole(eq(userId), eq(ApplicationRole.AUTHORITY_ADMIN))

        // act
        val result = userRoleApiService.changeAuthorityRole(userId, UserRoleDto.AUTHORITY_ADMIN, userId,
            setOf(Roles.UserRoles.AUTHORITY_ADMIN))

        // assert
        assertThat(result.id).isNotNull()

        // verify
        verify(keycloakService).joinApplicationRole(eq(userId), eq(ApplicationRole.AUTHORITY_ADMIN))
        verify(keycloakService).forceLogout(eq(userId))
    }

    @Test
    fun testChangeAuthorityRoleToOperatorAdmin() {
        // arrange
        doNothing().`when`(keycloakService).forceLogout(eq(userId))
        doNothing().`when`(keycloakService).joinApplicationRole(eq(userId), eq(ApplicationRole.OPERATOR_ADMIN))

        // act
        val result = userRoleApiService.changeAuthorityRole(userId, UserRoleDto.OPERATOR_ADMIN, userId,
            setOf(Roles.UserRoles.OPERATOR_ADMIN))

        // assert
        assertThat(result.id).isNotNull()

        // verify
        verify(keycloakService).joinApplicationRole(eq(userId), eq(ApplicationRole.OPERATOR_ADMIN))
        verify(keycloakService).forceLogout(eq(userId))
    }

    @Test
    fun testExceptiontoChangeAuthorityRole() {
        // arrange
        val errorMessage = "User with ID $userId does not have permission to change role to OPERATOR_ADMIN";

        // act
        assertThatThrownBy {
            userRoleApiService.changeAuthorityRole(userId, UserRoleDto.OPERATOR_ADMIN, userId,
                setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))
        }
            .isInstanceOf(WebApplicationException::class.java)
            .hasFieldOrPropertyWithValue("response.status", Response.Status.UNAUTHORIZED.statusCode)
            .hasMessage(errorMessage)

        // verify
        verify(keycloakService, never()).joinApplicationRole(eq(userId), eq(ApplicationRole.AUTHORITY_ADMIN))
        verify(keycloakService, never()).forceLogout(eq(userId))
    }
}
