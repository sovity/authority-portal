package de.sovity.authorityportal.web.integration.pages.organizationmanagement

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.api.model.organization.OrganizationLegalIdTypeDto
import de.sovity.authorityportal.api.model.organization.OrganizationRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.integration.pages.TestData.USER_EMAIL
import de.sovity.authorityportal.web.integration.pages.TestData.USER_FIRST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_LAST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_PHONE_NUMBER
import de.sovity.authorityportal.web.integration.pages.TestData.USER_POSITION
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationInfoApiService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify
import java.util.UUID


@QuarkusTest
@ExtendWith(MockitoExtension::class)
class OrganizationInfoApiServiceTest {

    @Inject
    lateinit var organizationInfoApiService: OrganizationInfoApiService

    @Inject
    lateinit var userService: UserService

    private val testMdsId = "MDSL1234ZZ"
    private val testOrganizationName = "Example Organization"
    private val testBusinessUnit = "Example Business Unit"
    private val testMainAddress = "123 Main St, Anytown, USA"
    private val testBillingAddress = "321 Main St, Anytown, USA"
    private val testLegalIdType = OrganizationLegalIdTypeDto.TAX_ID
    private val testTaxId = "US192837465"
    private val testUrl = "https://example.com"
    private val testDescription = null
    private val testRegistrationStatus = OrganizationRegistrationStatusDto.ACTIVE
    private val testAdminUserId = "9525c6ea-34d5-4c11-b9f8-133dc2086f00"
    private val testAdminFirstName = "Admin"
    private val testAdminLastName = "Adnub"
    private val testMainContactName = "Main Contact"
    private val testMainContactEmail = "main.contact@example.com"
    private val testMainPhone = "0123456789"
    private val testTechContactName = "Tech Contact"
    private val testTechContactEmail = "tech.contact@example.com"
    private val testTechPhone = "9876543210"

    @Test
    fun testOrganizationsOverview() {
        // act
        val result = organizationInfoApiService.organizationsOverview("test")

        // assert
        val organization1 = result.organizations[0]
        assertThat(result.organizations.size).isEqualTo(9)
        assertThat(organization1.mdsId).isEqualTo(testMdsId)
        assertThat(organization1.name).isEqualTo(testOrganizationName)
        assertThat(organization1.mainContactEmail).isEqualTo(testMainContactEmail)
        assertThat(organization1.numberOfUsers).isEqualTo(1)
        assertThat(organization1.numberOfConnectors).isEqualTo(0)
        assertThat(organization1.numberOfDataOffers).isEqualTo(0)
        assertThat(organization1.registrationStatus).isEqualTo(testRegistrationStatus)
    }

    @Test
    fun testGetOwnOrganizationDetails() {
        // arrange
        val userId = UUID.randomUUID().toString()
        val members = KeycloakUserDto(userId, USER_FIRST_NAME, USER_LAST_NAME, USER_EMAIL, USER_POSITION, USER_PHONE_NUMBER)
        userService.createUser(
            userId,
            testMdsId,
            UserOnboardingType.SELF_REGISTRATION
        ).also {
            it.registrationStatus = UserRegistrationStatus.ACTIVE
            it.update()
        }
        val keycloakService = mock(KeycloakService::class.java)
        `when`(keycloakService.getOrganizationMembers(eq(testMdsId))).thenReturn(listOf(members))
        `when`(keycloakService.getUserRoles(eq(userId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))
        `when`(keycloakService.getUserRoles(eq(testAdminUserId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_ADMIN))
        `when`(keycloakService.getUser(testAdminUserId)).thenReturn(KeycloakUserDto(testAdminUserId, testAdminFirstName, testAdminLastName, USER_EMAIL, USER_POSITION, USER_PHONE_NUMBER))
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        // act
        val result = organizationInfoApiService.getOwnOrganizationInformation(testMdsId)

        // assert
        assertThat(result.mdsId).isEqualTo(testMdsId)
        assertThat(result.name).isEqualTo(testOrganizationName)
        assertThat(result.businessUnit).isEqualTo(testBusinessUnit)
        assertThat(result.mainAddress).isEqualTo(testMainAddress)
        assertThat(result.billingAddress).isEqualTo(testBillingAddress)
        assertThat(result.legalIdType).isEqualTo(testLegalIdType)
        assertThat(result.legalId).isEqualTo(testTaxId)
        assertThat(result.url).isEqualTo(testUrl)
        assertThat(result.description).isEqualTo(testDescription)
        assertThat(result.registrationStatus).isEqualTo(testRegistrationStatus)
        assertThat(result.memberList).hasSize(1)
        assertThat(result.memberList[0].userId).isEqualTo(userId)
        assertThat(result.memberList[0].roles).containsOnly(UserRoleDto.PARTICIPANT_USER)
        assertThat(result.adminUserId).isEqualTo(testAdminUserId)
        assertThat(result.adminFirstName).isEqualTo(testAdminFirstName)
        assertThat(result.adminLastName).isEqualTo(testAdminLastName)
        assertThat(result.mainContactName).isEqualTo(testMainContactName)
        assertThat(result.mainContactEmail).isEqualTo(testMainContactEmail)
        assertThat(result.mainContactPhone).isEqualTo(testMainPhone)
        assertThat(result.techContactName).isEqualTo(testTechContactName)
        assertThat(result.techContactEmail).isEqualTo(testTechContactEmail)
        assertThat(result.techContactPhone).isEqualTo(testTechPhone)
        assertThat(result.createdBy).isEqualTo(testAdminUserId)
        verify(keycloakService).getOrganizationMembers(eq(testMdsId))
        verify(keycloakService).getUserRoles(eq(userId))
    }

    @Test
    fun testGetOrganizationDetails() {
        // arrange
        val userId = UUID.randomUUID().toString()
        val members = KeycloakUserDto(userId, USER_FIRST_NAME, USER_LAST_NAME, USER_EMAIL, USER_POSITION, USER_PHONE_NUMBER)
        userService.createUser(
            userId,
            testMdsId,
            UserOnboardingType.SELF_REGISTRATION
        ).also {
            it.registrationStatus = UserRegistrationStatus.ACTIVE
            it.update()
        }
        val keycloakService = mock(KeycloakService::class.java)
        `when`(keycloakService.getOrganizationMembers(eq(testMdsId))).thenReturn(listOf(members))
        `when`(keycloakService.getUserRoles(eq(userId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))
        `when`(keycloakService.getUserRoles(eq(testAdminUserId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_ADMIN))
        `when`(keycloakService.getUser(testAdminUserId)).thenReturn(KeycloakUserDto(testAdminUserId, testAdminFirstName, testAdminLastName, USER_EMAIL, USER_POSITION, USER_PHONE_NUMBER))
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        // act
        val result = organizationInfoApiService.getOrganizationInformation(testMdsId, "test")

        // assert
        assertThat(result.mdsId).isEqualTo(testMdsId)
        assertThat(result.name).isEqualTo(testOrganizationName)
        assertThat(result.businessUnit).isEqualTo(testBusinessUnit)
        assertThat(result.mainAddress).isEqualTo(testMainAddress)
        assertThat(result.billingAddress).isEqualTo(testBillingAddress)
        assertThat(result.legalIdType).isEqualTo(testLegalIdType)
        assertThat(result.legalId).isEqualTo(testTaxId)
        assertThat(result.url).isEqualTo(testUrl)
        assertThat(result.description).isEqualTo(testDescription)
        assertThat(result.registrationStatus).isEqualTo(testRegistrationStatus)
        assertThat(result.memberCount).isEqualTo(1)
        assertThat(result.connectorCount).isEqualTo(0)
        assertThat(result.dataOfferCount).isEqualTo(0)
        assertThat(result.memberList).hasSize(1)
        assertThat(result.memberList[0].userId).isEqualTo(userId)
        assertThat(result.memberList[0].roles).containsOnly(UserRoleDto.PARTICIPANT_USER)
        assertThat(result.adminUserId).isEqualTo(testAdminUserId)
        assertThat(result.adminFirstName).isEqualTo(testAdminFirstName)
        assertThat(result.adminLastName).isEqualTo(testAdminLastName)
        assertThat(result.mainContactName).isEqualTo(testMainContactName)
        assertThat(result.mainContactEmail).isEqualTo(testMainContactEmail)
        assertThat(result.mainContactPhone).isEqualTo(testMainPhone)
        assertThat(result.techContactName).isEqualTo(testTechContactName)
        assertThat(result.techContactEmail).isEqualTo(testTechContactEmail)
        assertThat(result.techContactPhone).isEqualTo(testTechPhone)
        assertThat(result.createdBy).isEqualTo(testAdminUserId)
        verify(keycloakService).getOrganizationMembers(eq(testMdsId))
        verify(keycloakService).getUserRoles(eq(userId))
    }
}
