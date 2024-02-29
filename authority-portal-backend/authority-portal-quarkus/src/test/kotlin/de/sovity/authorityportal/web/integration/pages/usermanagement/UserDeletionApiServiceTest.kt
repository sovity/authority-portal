package de.sovity.authorityportal.web.integration.pages.usermanagement

import de.sovity.authorityportal.web.pages.usermanagement.UserDeletionApiService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClient
import de.sovity.authorityportal.web.thirdparty.broker.BrokerClientService
import de.sovity.authorityportal.web.thirdparty.caas.CaasClient
import de.sovity.authorityportal.web.thirdparty.daps.DapsClient
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserDeletionApiServiceTest {

    @Inject
    lateinit var userDeletionApiService: UserDeletionApiService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var organizationService: OrganizationService

    lateinit var keycloakService: KeycloakService

    private val test = "test"
    private val creatorId = "00000000-0000-0000-0000-000000000003"
    private val successorId = "00000000-0000-0000-0000-000000000007"
    private val lastAdminId = "00000000-0000-0000-0000-000000000001"

    @BeforeEach
    fun setup() {
        keycloakService = Mockito.mock(KeycloakService::class.java)
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)
    }

    @Test
    @TestTransaction
    fun testCheckUserDeletionCreator() {
        // arrange
        val mdsId = "MDSL2222BB"

        `when`(keycloakService.getAuthorityAdmins()).thenReturn(listOf(
            KeycloakUserDto(
                userId = "anyId",
                firstName = "anyName",
                lastName = "anyName",
                email = "empty",
            )
        ))
        `when`(keycloakService.getParticipantAdmins(eq(mdsId))).thenReturn(listOf(
            KeycloakUserDto(
                userId = creatorId,
                firstName = "To Be Deleted",
                lastName = "User",
                email = "empty",
            ),
            KeycloakUserDto(
                userId = successorId,
                firstName = "Expected",
                lastName = "Successor",
                email = "empty",
            )
        ))

        // act
        val result = userDeletionApiService.checkUserDeletion(creatorId)

        // assert
        assertThat(result.canBeDeleted).isTrue
        assertThat(result.isLastParticipantAdmin).isFalse
        assertThat(result.isOrganizationCreator).isTrue
        assertThat(result.possibleSuccessors).hasSize(1)
        assertThat(result.possibleSuccessors[0].userId).isEqualTo(successorId)
        assertThat(result.possibleSuccessors[0].firstName).isEqualTo("Expected")
        assertThat(result.possibleSuccessors[0].lastName).isEqualTo("Successor")
    }

    @Test
    @TestTransaction
    fun testHandleUserDeletionCreator() {
        // arrange
        val mdsId = "MDSL2222BB"
        val creatorId = "00000000-0000-0000-0000-000000000003"
        val successorId = "00000000-0000-0000-0000-000000000007"

        `when`(keycloakService.getAuthorityAdmins()).thenReturn(listOf(
            KeycloakUserDto(
                userId = "anyId",
                firstName = "anyName",
                lastName = "anyName",
                email = "empty",
            )
        ))
        `when`(keycloakService.getParticipantAdmins(eq(mdsId))).thenReturn(listOf(
            KeycloakUserDto(
                userId = creatorId,
                firstName = "To Be Deleted",
                lastName = "User",
                email = "empty",
            ),
            KeycloakUserDto(
                userId = successorId,
                firstName = "Expected",
                lastName = "Successor",
                email = "empty",
            )
        ))
        doNothing().`when`(keycloakService).deleteUser(eq(creatorId))

        // act
        userDeletionApiService.handleUserDeletion(creatorId, successorId, "adminUserId")

        // assert
        val org = organizationService.getOrganizationOrThrow(mdsId)
        assertThat(org.createdBy).isEqualTo(successorId)
    }

    @Test
    @TestTransaction
    fun testCheckUserDeletionLastAdmin() {
        // arrange
        val mdsId = "MDSL1111AA"

        `when`(keycloakService.getAuthorityAdmins()).thenReturn(listOf(
            KeycloakUserDto(
                userId = "anyId",
                firstName = "anyName",
                lastName = "anyName",
                email = "empty",
            )
        ))
        `when`(keycloakService.getParticipantAdmins(eq(mdsId))).thenReturn(listOf(
            KeycloakUserDto(
                userId = lastAdminId,
                firstName = "To Be Deleted",
                lastName = "User",
                email = "empty",
            )
        ))

        // act
        val result = userDeletionApiService.checkUserDeletion(lastAdminId)

        // assert
        assertThat(result.canBeDeleted).isTrue
        assertThat(result.isLastParticipantAdmin).isTrue
        assertThat(result.isOrganizationCreator).isTrue
        assertThat(result.possibleSuccessors).isEmpty()
    }

    @Test
    @TestTransaction
    fun testHandleUserDeletionLastAdmin() {
        // arrange
        setupClients()
        val mdsId = "MDSL1111AA"

        `when`(keycloakService.getAuthorityAdmins()).thenReturn(listOf(
            KeycloakUserDto(
                userId = "anyId",
                firstName = "anyName",
                lastName = "anyName",
                email = "empty",
            )
        ))
        `when`(keycloakService.getParticipantAdmins(eq(mdsId))).thenReturn(listOf(
            KeycloakUserDto(
                userId = lastAdminId,
                firstName = "To Be Deleted",
                lastName = "User",
                email = "empty",
            )
        ))
        doNothing().`when`(keycloakService).deleteOrganization(mdsId)
        doNothing().`when`(keycloakService).deleteUsers(Mockito.anyList())

        // act
        userDeletionApiService.handleUserDeletion(lastAdminId, null, "adminUserId")

        // assert
        val users = userService.getUsersByMdsId(mdsId)
        assertThat(users).isEmpty()
        assertThatThrownBy { organizationService.getOrganizationOrThrow(mdsId) }.isInstanceOf(IllegalStateException::class.java)
    }

    @Test
    @TestTransaction
    fun testCheckUserCanNotBeDeleted() {
        // arrange
        val mdsId = "MDSL1111AA"

        `when`(keycloakService.getAuthorityAdmins()).thenReturn(listOf(
            KeycloakUserDto(
                userId = lastAdminId,
                firstName = "To Be Deleted",
                lastName = "User",
                email = "empty",
            )
        ))
        `when`(keycloakService.getParticipantAdmins(eq(mdsId))).thenReturn(listOf(
            KeycloakUserDto(
                userId = lastAdminId,
                firstName = "To Be Deleted",
                lastName = "User",
                email = "empty",
            )
        ))

        // act
        val result = userDeletionApiService.checkUserDeletion(lastAdminId)

        // assert
        assertThat(result.canBeDeleted).isFalse
        assertThat(result.isLastParticipantAdmin).isTrue
        assertThat(result.isOrganizationCreator).isTrue
        assertThat(result.possibleSuccessors).isEmpty()
    }

    @Test
    @TestTransaction
    fun testHandleUserCanNotBeDeleted() {
        // arrange
        val mdsId = "MDSL1111AA"

        `when`(keycloakService.getAuthorityAdmins()).thenReturn(listOf(
            KeycloakUserDto(
                userId = lastAdminId,
                firstName = "To Be Deleted",
                lastName = "User",
                email = "empty",
            )
        ))
        `when`(keycloakService.getParticipantAdmins(eq(mdsId))).thenReturn(listOf(
            KeycloakUserDto(
                userId = lastAdminId,
                firstName = "To Be Deleted",
                lastName = "User",
                email = "empty",
            )
        ))

        // act & assert
        assertThatThrownBy {
            userDeletionApiService.handleUserDeletion(lastAdminId, null, "adminUserId")
        }.isInstanceOf(IllegalStateException::class.java)
    }

    private fun setupClients() {
        val brokerClientService = Mockito.mock(BrokerClientService::class.java)
        val brokerClient = Mockito.mock(BrokerClient::class.java)
        val daspClientService = Mockito.mock(DapsClientService::class.java)
        val dapsClient = Mockito.mock(DapsClient::class.java)
        val caasClient = Mockito.mock(CaasClient::class.java)

        QuarkusMock.installMockForType(brokerClientService, BrokerClientService::class.java)
        `when`(brokerClientService.forEnvironment(eq(test))).thenReturn(brokerClient)
        doNothing().`when`(brokerClient).removeConnector(Mockito.anyString())

        QuarkusMock.installMockForType(daspClientService, DapsClientService::class.java)
        `when`(daspClientService.forEnvironment(eq(test))).thenReturn(dapsClient)
        doNothing().`when`(dapsClient).deleteClient(Mockito.anyString())

        QuarkusMock.installMockForType(caasClient, CaasClient::class.java)
        doNothing().`when`(caasClient).deleteCaas(Mockito.anyList())
    }
}
