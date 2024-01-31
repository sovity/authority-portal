package de.sovity.authorityportal.web.integration.pages.organizationmanagement

import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationRegistrationApiService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import jakarta.ws.rs.NotAuthorizedException
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test

@QuarkusTest
class OrganizationRegistrationApiServiceTest {

    @Inject
    lateinit var organizationRegistrationApiService: OrganizationRegistrationApiService
    @Inject
    lateinit var organizationService: OrganizationService
    @Inject
    lateinit var userService: UserService


    @Test
    fun shouldApproveOrganization() {
        // arrange
        val mdsId = "MDSL2222CC"
        val userId = "00000000-0000-0000-0000-000000000008"

        // act
        val result = organizationRegistrationApiService.approveOrganization(mdsId, userId)
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        val user = userService.getUserOrThrow(userId)

        // assert
        assertThat(result.id).isNotNull()
        assertThat(organization.registrationStatus).isEqualTo(OrganizationRegistrationStatus.ACTIVE)
        assertThat(user.registrationStatus).isEqualTo(UserRegistrationStatus.ACTIVE)
    }

    @Test
    fun shouldRejectOrganization() {
        // arrange
        val mdsId = "MDSL3334C4"
        val userId = "00000000-0000-0000-0000-000000000005"

        // act
        val result = organizationRegistrationApiService.rejectOrganization(mdsId, userId)
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        val user = userService.getUserOrThrow(userId)

        // assert
        assertThat(result.id).isNotNull()
        assertThat(organization.registrationStatus).isEqualTo(OrganizationRegistrationStatus.REJECTED)
        assertThat(user.registrationStatus).isEqualTo(UserRegistrationStatus.REJECTED)
    }

    @Test
    fun shouldThrowExceptionForRejectOrganization() {
        assertThatThrownBy {
            organizationRegistrationApiService.rejectOrganization("MDSL2222BB", "00000000-0000-0000-0000-000000000007")
        }.isInstanceOf(NotAuthorizedException::class.java)
    }
}
