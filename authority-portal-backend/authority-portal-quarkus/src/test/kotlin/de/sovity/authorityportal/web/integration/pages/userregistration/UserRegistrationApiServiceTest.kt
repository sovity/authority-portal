package de.sovity.authorityportal.web.integration.pages.userregistration

import de.sovity.authorityportal.api.model.CreateOrganizationRequest
import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_ADDRESS
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_DUNS
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_SECURITY_EMAIL
import de.sovity.authorityportal.web.integration.pages.TestData.ORG_URL
import de.sovity.authorityportal.web.pages.userregistration.UserRegistrationApiService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserRegistrationApiServiceTest {

    @Inject
    lateinit var userRegistrationApiService: UserRegistrationApiService
    @Inject
    lateinit var userService: UserService
    @Inject
    lateinit var organizationService: OrganizationService

    val userId = "00000000-0000-0000-0000-00000001";

    @Test
    fun testUserRegistrationStatus() {
        // act
        val result = userRegistrationApiService.userRegistrationStatus(userId)

        // assert
        assertThat(result).isNotNull()
        assertThat(result.registrationStatus).isEqualTo(UserRegistrationStatusDto.ACTIVE)
    }

    @Test
    fun testCreateOrganization() {
        // arrange
        val organizationRequest = CreateOrganizationRequest(ORG_NAME, ORG_ADDRESS, ORG_DUNS, ORG_URL, ORG_SECURITY_EMAIL)
        val keyCloakService = Mockito.mock(KeycloakService::class.java)
        QuarkusMock.installMockForType(keyCloakService, KeycloakService::class.java)

        doNothing().`when`(keyCloakService).createOrganization(anyString())
        doNothing().`when`(keyCloakService).joinOrganization(eq(userId), anyString(), eq(OrganizationRole.PARTICIPANT_ADMIN))
        doNothing().`when`(keyCloakService).forceLogout(eq(userId))

        // act
        val result = userRegistrationApiService.createOrganization(organizationRequest, userId)
        val user = userService.getUserOrThrow(userId)
        val organization = organizationService.getOrganizationOrThrow(result.id)

        // assert
        assertThat(result).isNotNull()
        assertThat(user.registrationStatus).isEqualTo(UserRegistrationStatus.PENDING)
        assertThat(result.id).isEqualTo(user.organizationMdsId)
        assertThat(organization).isNotNull()
        assertThat(organization.name).isEqualTo(ORG_NAME)
        assertThat(organization.address).isEqualTo(ORG_ADDRESS)
        assertThat(organization.duns).isEqualTo(ORG_DUNS)
        assertThat(organization.url).isEqualTo(ORG_URL)
        assertThat(organization.securityEmail).isEqualTo(ORG_SECURITY_EMAIL)
        assertThat(organization.createdBy).isEqualTo(userId)
        assertThat(organization.createdAt).isNotNull()
        assertThat(organization.registrationStatus).isEqualTo(OrganizationRegistrationStatus.PENDING)

        // verify
        verify(keyCloakService).createOrganization(anyString())
        verify(keyCloakService).joinOrganization(eq(userId), anyString(), eq(OrganizationRole.PARTICIPANT_ADMIN))
        verify(keyCloakService).forceLogout(eq(userId))
    }
}
