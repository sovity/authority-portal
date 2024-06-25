package de.sovity.authorityportal.web.tests.services

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.RegistrationRequestDto
import de.sovity.authorityportal.api.model.organization.OrganizationLegalIdTypeDto
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.seeds.utils.dummyDevUserUuid
import de.sovity.authorityportal.web.pages.organizationmanagement.toDb
import de.sovity.authorityportal.web.tests.useMockNow
import de.sovity.authorityportal.web.tests.useUnauthenticated
import de.sovity.authorityportal.web.tests.withOffsetDateTimeComparator
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq
import org.mockito.kotlin.whenever
import java.time.OffsetDateTime

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class FirstUserRegistrationTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Inject
    lateinit var dsl: DSLContext

    @InjectMock
    lateinit var keycloakService: KeycloakService

    val request = RegistrationRequestDto(
        userEmail = "testuser@test.sovity.io",
        userFirstName = "Test",
        userLastName = "User",
        userJobTitle = "Software Developer",
        userPhone = "+1234567890",
        userPassword = "securePassword123",
        organizationName = "Test Organization",
        organizationUrl = "https://www.test-organization.sovity.io",
        organizationBusinessUnit = "IT",
        organizationIndustry = "Software",
        organizationAddress = "Test Street, 12345, Test City, Test Country",
        organizationBillingAddress = "Test Street, 12345, Test City, Test Country",
        organizationDescription = "This is a test organization",
        organizationLegalIdType = OrganizationLegalIdTypeDto.COMMERCE_REGISTER_INFO,
        organizationLegalIdNumber = "HRB123456",
        organizationCommerceRegisterLocation = "Test City",
        organizationMainContactName = "Test Contact",
        organizationMainContactEmail = "contact@test.sovity.io",
        organizationMainContactPhone = "+1234567890",
        organizationTechContactName = "Test Tech Contact",
        organizationTechContactEmail = "techcontact@test.sovity.io",
        organizationTechContactPhone = "+1234567890"
    )

    @Test
    @TestTransaction
    fun `register user for the first time creates a user and an organization with correct data and auto-approves them`() {
        // arrange
        val now = OffsetDateTime.now()

        useUnauthenticated()
        useMockNow(now)

        doNothing().whenever(keycloakService).sendInvitationEmail(any())
        doNothing().whenever(keycloakService).createOrganization(any())
        doNothing().whenever(keycloakService).joinOrganization(any(), any(), any())
        whenever(keycloakService.createUser(
            eq(request.userEmail), eq(request.userFirstName), eq(request.userLastName), eq(request.userPassword)
        )).thenReturn(dummyDevUserUuid(0))

        // act
        val result = uiResource.registerUser(request)

        // assert
        assertThat(result).isNotNull
        assertThat(result.id).isEqualTo(dummyDevUserUuid(0))
        assertThat(result.changedDate).isEqualTo(now)

        val organizations = dsl.selectFrom(Tables.ORGANIZATION).fetch()
        assertThat(organizations).hasSize(1)

        val actualOrganization = organizations.first()
        val actualUser = dsl.selectFrom(Tables.USER).where(Tables.USER.ID.eq(dummyDevUserUuid(0))).fetchOne()

        assertThat(actualOrganization).isNotNull
        assertThat(actualUser).isNotNull

        val expectedUser = dsl.newRecord(Tables.USER).also {
            it.id = dummyDevUserUuid(0)
            it.organizationMdsId = actualOrganization!!.mdsId
            it.registrationStatus = UserRegistrationStatus.ACTIVE
            it.createdAt = now
            it.email = request.userEmail
            it.firstName = request.userFirstName
            it.lastName = request.userLastName
            it.jobTitle = request.userJobTitle
            it.phone = request.userPhone
            it.onboardingType = UserOnboardingType.SELF_REGISTRATION
            it.invitedBy = null
        }

        val expectedOrganization = dsl.newRecord(Tables.ORGANIZATION).also {
            it.mdsId = actualOrganization!!.mdsId
            it.name = request.organizationName
            it.address = request.organizationAddress
            it.url = request.organizationUrl
            it.createdBy = dummyDevUserUuid(0)
            it.registrationStatus = OrganizationRegistrationStatus.ACTIVE
            it.createdAt = now
            it.businessUnit = request.organizationBusinessUnit
            it.billingAddress = request.organizationBillingAddress
            it.taxId = null
            it.commerceRegisterNumber = request.organizationLegalIdNumber
            it.commerceRegisterLocation = request.organizationCommerceRegisterLocation
            it.mainContactName = request.organizationMainContactName
            it.mainContactEmail = request.organizationMainContactEmail
            it.mainContactPhone = request.organizationMainContactPhone
            it.techContactName = request.organizationTechContactName
            it.techContactEmail = request.organizationTechContactEmail
            it.techContactPhone = request.organizationTechContactPhone
            it.legalIdType = request.organizationLegalIdType.toDb()
            it.description = request.organizationDescription
            it.industry = request.organizationIndustry
        }

        assertThat(actualOrganization!!.copy())
            .usingRecursiveComparison()
            .withOffsetDateTimeComparator()
            .withStrictTypeChecking()
            .isEqualTo(expectedOrganization.copy())

        assertThat(actualUser!!.copy())
            .usingRecursiveComparison()
            .withOffsetDateTimeComparator()
            .withStrictTypeChecking()
            .isEqualTo(expectedUser.copy())
    }
}