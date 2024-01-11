package de.sovity.authorityportal.web.integration.pages.organizationmanagement

import de.sovity.authorityportal.api.model.InviteOrganizationRequest
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.integration.pages.TestData
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_ADDRESS
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_SECURITY_EMAIL
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_TAX_ID
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_URL
import de.sovity.authorityportal.web.integration.pages.TestData.USER_FIRST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_LAST_NAME
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationInvitationApiService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mockito
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify
import java.util.UUID

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class OrganizationInvitationApiServiceTest {

    @Inject
    lateinit var organizationInvitationApiService: OrganizationInvitationApiService
    @Inject
    lateinit var organizationService: OrganizationService
    @Inject
    lateinit var userService: UserService

    @Test
    fun shouldInviteOrganization() {
        // arrange
        val userId = UUID.randomUUID().toString()
        val email = UUID.randomUUID().toString() // Generate a random email to avoid DB constraints with existing users
        val keycloakUser = KeycloakUserDto(
            userId = userId,
            email = email,
            firstName = USER_FIRST_NAME,
            lastName = USER_LAST_NAME,
            position = TestData.USER_POSITION,
            phoneNumber = TestData.USER_PHONE_NUMBER
        )
        val keyCloakService = Mockito.mock(KeycloakService::class.java)
        QuarkusMock.installMockForType(keyCloakService, KeycloakService::class.java)

        `when`(keyCloakService.createUser(eq(email), eq(USER_FIRST_NAME), eq(USER_LAST_NAME))).thenReturn(keycloakUser)
        doNothing().`when`(keyCloakService).createOrganization(anyString())
        doNothing().`when`(keyCloakService).joinOrganization(eq(userId), anyString(), eq(OrganizationRole.PARTICIPANT_ADMIN))
        doNothing().`when`(keyCloakService).sendInvitationEmail(eq(userId))
        val request = InviteOrganizationRequest(
            email,
            USER_FIRST_NAME,
            USER_LAST_NAME,
            ORG_NAME,
            ORG_ADDRESS,
            ORG_TAX_ID,
            ORG_URL,
            ORG_SECURITY_EMAIL
        )

        // act
        val result = organizationInvitationApiService.inviteOrganization(request, userId)

        // assert
        assertNotNull(result.id)
        val organization = organizationService.getOrganizationOrThrow(result.id)
        val user = userService.getUserOrThrow(organization.createdBy)
        assertThat(organization.registrationStatus).isEqualTo(OrganizationRegistrationStatus.INVITED)
        assertThat(organization.name).isEqualTo(ORG_NAME)
        assertThat(organization.address).isEqualTo(ORG_ADDRESS)
        assertThat(organization.taxId).isEqualTo(ORG_TAX_ID)
        assertThat(organization.url).isEqualTo(ORG_URL)
        assertThat(organization.mainContactEmail).isEqualTo(ORG_SECURITY_EMAIL)
        assertThat(user.registrationStatus).isEqualTo(UserRegistrationStatus.INVITED)

        // verify
        verify(keyCloakService).createUser(eq(email), eq(USER_FIRST_NAME), eq(USER_LAST_NAME))
        verify(keyCloakService).createOrganization(anyString())
        verify(keyCloakService).joinOrganization(eq(userId), anyString(), eq(OrganizationRole.PARTICIPANT_ADMIN))
        verify(keyCloakService).sendInvitationEmail(eq(userId))
    }
}
