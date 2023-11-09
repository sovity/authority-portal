package de.sovity.authorityportal.web.integration.pages.usermanagement

import de.sovity.authorityportal.api.model.InviteParticipantUserRequest
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.integration.pages.TestData.USER_EMAIL
import de.sovity.authorityportal.web.integration.pages.TestData.USER_FIRST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_LAST_NAME
import de.sovity.authorityportal.web.pages.usermanagement.UserInvitationApiService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import io.quarkus.test.junit.QuarkusMock.installMockForType
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import java.util.UUID
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserInvitationApiServiceTest {

    @Inject
    lateinit var userInvitationApiService: UserInvitationApiService
    @Inject
    lateinit var userService: UserService

    @Test
    fun testInviteParticipantUser() {
        // arrange
        val userId = UUID.randomUUID().toString()
        val request = InviteParticipantUserRequest(USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, UserRoleDto.PARTICIPANT_USER)
        val mdsId = "MDSL1111AA";

        val keyCloakService = mock(KeycloakService::class.java)
        installMockForType(keyCloakService, KeycloakService::class.java)

        `when`(keyCloakService.createUser(eq(USER_EMAIL), eq(USER_FIRST_NAME), eq(USER_LAST_NAME))).thenReturn(userId)
        doNothing().`when`(keyCloakService).sendInvitationEmail(eq(userId))
        doNothing().`when`(keyCloakService).joinOrganization(eq(userId), eq(mdsId), eq(OrganizationRole.PARTICIPANT_USER))

        // act
        val result = userInvitationApiService.inviteParticipantUser(request, mdsId, "test")
        val user = userService.getUserOrThrow(result.id)

        // assert
        assertThat(user).isNotNull()
        assertThat(user.id).isEqualTo(userId)
        assertThat(user.registrationStatus).isEqualTo(UserRegistrationStatus.INVITED)
        assertThat(user.organizationMdsId).isEqualTo(mdsId)
        assertThat(user.createdAt).isNotNull()

        // verify
        verify(keyCloakService).createUser(eq(USER_EMAIL), eq(USER_FIRST_NAME), eq(USER_LAST_NAME))
        verify(keyCloakService).sendInvitationEmail(eq(userId))
        verify(keyCloakService).joinOrganization(eq(userId), eq(mdsId), eq(OrganizationRole.PARTICIPANT_USER))
    }
}
