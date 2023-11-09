package de.sovity.authorityportal.web.integration.pages.organizationmanagement

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.integration.pages.TestData.USER_EMAIL
import de.sovity.authorityportal.web.integration.pages.TestData.USER_FIRST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_LAST_NAME
import de.sovity.authorityportal.web.integration.pages.TestData.USER_PHONE_NUMBER
import de.sovity.authorityportal.web.integration.pages.TestData.USER_POSITION
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationInfoApiService
import de.sovity.authorityportal.web.pages.organizationmanagement.toDto
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import java.util.UUID
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify


@QuarkusTest
@ExtendWith(MockitoExtension::class)
class OrganizationInfoApiServiceTest {

    @Inject
    lateinit var organizationInfoApiService: OrganizationInfoApiService

    private val testMdsId = "MDSL1234ZZ"
    private val testOrganizationName = "Example Organization"
    private val testUrl = "https://example.com"
    val enviromentId = "test"

    @Test
    fun testOrganizationsOverview() {
        // act
        val result = organizationInfoApiService.organizationsOverview()

        // assert
        val organization1 = result.organizations[0]
        assertThat(result.organizations.size).isEqualTo(9)
        assertThat(organization1.registrationStatus).isEqualTo(OrganizationRegistrationStatus.ACTIVE.toDto())
        assertThat(organization1.name).isEqualTo(testOrganizationName)
        assertThat(organization1.url).isEqualTo(testUrl)
        assertThat(organization1.mdsId).isEqualTo(testMdsId)
    }

    @Test
    fun testOwnOrganizationDetails() {
        // arrange
        val userId = UUID.randomUUID().toString()
        val members = KeycloakUserDto(userId, USER_FIRST_NAME, USER_LAST_NAME, USER_EMAIL, USER_POSITION, USER_PHONE_NUMBER)
        val keycloakService = mock(KeycloakService::class.java)
        `when`(keycloakService.getOrganizationMembers(eq(testMdsId))).thenReturn(listOf(members))
        `when`(keycloakService.getUserRoles(eq(userId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        // act
        val result = organizationInfoApiService.ownOrganizationDetails(testMdsId)

        // assert
        assertThat(result.mdsId).isEqualTo(testMdsId)
        assertThat(result.name).isEqualTo(testOrganizationName)
        assertThat(result.address).isEqualTo("123 Main St, Anytown, USA")
        assertThat(result.url).isEqualTo(testUrl)
        assertThat(result.securityEmail).isEqualTo("security@example.com")
        assertThat(result.registrationStatus).isEqualTo(OrganizationRegistrationStatus.ACTIVE.toDto())
        assertThat(result.name).isEqualTo(testOrganizationName)
        assertThat(result.url).isEqualTo(testUrl)
        assertThat(result.createdBy).isEqualTo("9525c6ea-34d5-4c11-b9f8-133dc2086f00")
        assertThat(result.memberInfos).hasSize(1)
        assertThat(result.memberInfos[0].userId).isEqualTo(userId)
        assertThat(result.memberInfos[0].roles).containsOnly(UserRoleDto.PARTICIPANT_USER)
        verify(keycloakService).getOrganizationMembers(eq(testMdsId))
        verify(keycloakService).getUserRoles(eq(userId))
    }

    @Test
    fun testGetOrganizationDetails() {
        // arrange
        val userId = UUID.randomUUID().toString()
        val members = KeycloakUserDto(userId, USER_FIRST_NAME, USER_LAST_NAME, USER_EMAIL, USER_POSITION, USER_PHONE_NUMBER)
        val keycloakService = mock(KeycloakService::class.java)
        `when`(keycloakService.getOrganizationMembers(eq(testMdsId))).thenReturn(listOf(members))
        `when`(keycloakService.getUserRoles(eq(userId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        // act
        val result = organizationInfoApiService.getOrganizationInformation(testMdsId, enviromentId)

        // assert
        assertThat(result.mdsId).isEqualTo(testMdsId)
        assertThat(result.name).isEqualTo(testOrganizationName)
        assertThat(result.address).isEqualTo("123 Main St, Anytown, USA")
        assertThat(result.url).isEqualTo(testUrl)
        assertThat(result.securityEmail).isEqualTo("security@example.com")
        assertThat(result.registrationStatus).isEqualTo(OrganizationRegistrationStatus.ACTIVE.toDto())
        assertThat(result.name).isEqualTo(testOrganizationName)
        assertThat(result.url).isEqualTo(testUrl)
        assertThat(result.createdBy).isEqualTo("9525c6ea-34d5-4c11-b9f8-133dc2086f00")
        assertThat(result.memberInfos).hasSize(1)
        assertThat(result.memberInfos[0].userId).isEqualTo(userId)
        assertThat(result.memberInfos[0].roles).containsOnly(UserRoleDto.PARTICIPANT_USER)
        assertThat(result.memberCount).isEqualTo(1)
        assertThat(result.connectorCount).isEqualTo(0)
        verify(keycloakService).getOrganizationMembers(eq(testMdsId))
        verify(keycloakService).getUserRoles(eq(userId))
    }
}
