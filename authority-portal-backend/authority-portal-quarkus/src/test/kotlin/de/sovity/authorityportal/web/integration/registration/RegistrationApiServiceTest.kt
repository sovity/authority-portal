package de.sovity.authorityportal.web.integration.registration

import de.sovity.authorityportal.api.model.RegistrationRequestDto
import de.sovity.authorityportal.web.pages.registration.RegistrationApiService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import java.util.UUID
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.mockito.Mockito.anyString
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class RegistrationApiServiceTest {

    @Inject
    lateinit var registrationApiService: RegistrationApiService
    @Inject
    lateinit var userService: UserService
    @Inject
    lateinit var organizationService: OrganizationService

    @Test
    fun testRegisterUserAndOrganization() {
        // arrange
        val userId = UUID.randomUUID().toString();
        val keyCloakService = Mockito.mock(KeycloakService::class.java)
        QuarkusMock.installMockForType(keyCloakService, KeycloakService::class.java)

        `when`(keyCloakService.createUser(eq(TestRegistrationData.userEmail), eq(TestRegistrationData.userFirstName),
            eq(TestRegistrationData.userLastName))).thenReturn(userId)
        doNothing().`when`(keyCloakService).createOrganization(anyString())
        doNothing().`when`(keyCloakService).joinOrganization(eq(userId), anyString(), eq(OrganizationRole.PARTICIPANT_ADMIN))
        doNothing().`when`(keyCloakService).sendInvitationEmail(eq(userId))

        // act
        val result = registrationApiService.registerUserAndOrganization(createTestRegistrationRequestDto())
        val user = userService.getUserOrThrow(userId)
        val organization = organizationService.getOrganizationOrThrow(user.organizationMdsId)

        // assert
        assertThat(result.id).isEqualTo(userId)

        // user assertions
        assertThat(user.email).isEqualTo(TestRegistrationData.userEmail)
        assertThat(user.firstName).isEqualTo(TestRegistrationData.userFirstName)
        assertThat(user.lastName).isEqualTo(TestRegistrationData.userLastName)
        assertThat(user.jobTitle).isEqualTo(TestRegistrationData.userJobTitle)
        assertThat(user.phone).isEqualTo(TestRegistrationData.userPhone)

        // organization assertions
        assertThat(organization.name).isEqualTo(TestRegistrationData.organizationName)
        assertThat(organization.url).isEqualTo(TestRegistrationData.organizationUrl)
        assertThat(organization.businessUnit).isEqualTo(TestRegistrationData.organizationBusinessUnit)
        assertThat(organization.address).isEqualTo(TestRegistrationData.organizationAddress)
        assertThat(organization.billingAddress).isEqualTo(TestRegistrationData.organizationBillingAddress)
        assertThat(organization.taxId).isEqualTo(TestRegistrationData.organizationTaxId)
        assertThat(organization.commerceRegisterNumber).isEqualTo(TestRegistrationData.organizationCommerceRegisterNumber)
        assertThat(organization.commerceRegisterLocation).isEqualTo(TestRegistrationData.organizationCommerceRegisterLocation)
        assertThat(organization.mainContactName).isEqualTo(TestRegistrationData.organizationMainContactName)
        assertThat(organization.mainContactEmail).isEqualTo(TestRegistrationData.organizationMainContactEmail)
        assertThat(organization.mainContactPhone).isEqualTo(TestRegistrationData.organizationMainContactPhone)
        assertThat(organization.techContactName).isEqualTo(TestRegistrationData.organizationTechContactName)
        assertThat(organization.techContactEmail).isEqualTo(TestRegistrationData.organizationTechContactEmail)
        assertThat(organization.techContactPhone).isEqualTo(TestRegistrationData.organizationTechContactPhone)

        // verify
        verify(keyCloakService).createUser(eq(TestRegistrationData.userEmail), eq(TestRegistrationData.userFirstName),
            eq(TestRegistrationData.userLastName))
        verify(keyCloakService).createOrganization(anyString())
        verify(keyCloakService).joinOrganization(eq(userId), anyString(), eq(OrganizationRole.PARTICIPANT_ADMIN))
        verify(keyCloakService).sendInvitationEmail(eq(userId))
    }

    fun createTestRegistrationRequestDto(): RegistrationRequestDto {
        return RegistrationRequestDto().apply {
            userEmail = TestRegistrationData.userEmail
            userFirstName = TestRegistrationData.userFirstName
            userLastName = TestRegistrationData.userLastName
            userJobTitle = TestRegistrationData.userJobTitle
            userPhone = TestRegistrationData.userPhone
            organizationName = TestRegistrationData.organizationName
            organizationUrl = TestRegistrationData.organizationUrl
            organizationBusinessUnit = TestRegistrationData.organizationBusinessUnit
            organizationAddress = TestRegistrationData.organizationAddress
            organizationBillingAddress = TestRegistrationData.organizationBillingAddress
            organizationTaxId = TestRegistrationData.organizationTaxId
            organizationCommerceRegisterNumber = TestRegistrationData.organizationCommerceRegisterNumber
            organizationCommerceRegisterLocation = TestRegistrationData.organizationCommerceRegisterLocation
            organizationMainContactName = TestRegistrationData.organizationMainContactName
            organizationMainContactEmail = TestRegistrationData.organizationMainContactEmail
            organizationMainContactPhone = TestRegistrationData.organizationMainContactPhone
            organizationTechContactName = TestRegistrationData.organizationTechContactName
            organizationTechContactEmail = TestRegistrationData.organizationTechContactEmail
            organizationTechContactPhone = TestRegistrationData.organizationTechContactPhone
        }
    }

    object TestRegistrationData {
        val userEmail = "test@example.com"
        val userFirstName = "John"
        val userLastName = "Doe"
        val userJobTitle = "Software Developer"
        val userPhone = "123456789"
        val organizationName = "Test Organization"
        val organizationUrl = "http://testorg.com"
        val organizationBusinessUnit = "IT"
        val organizationAddress = "Test Address"
        val organizationBillingAddress = "Test Billing Address"
        val organizationTaxId = "123456"
        val organizationCommerceRegisterNumber = "7890ABC"
        val organizationCommerceRegisterLocation = "Test Contact"
        val organizationMainContactName = "contact@testorg.com"
        val organizationMainContactEmail = "9876543210"
        val organizationMainContactPhone = "Tech Test Contact"
        val organizationTechContactName = "tech@testorg.com"
        val organizationTechContactEmail = "123987654"
        val organizationTechContactPhone = "123987654"
    }
}