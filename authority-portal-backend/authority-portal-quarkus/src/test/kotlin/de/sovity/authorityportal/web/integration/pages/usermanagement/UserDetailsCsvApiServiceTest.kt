package de.sovity.authorityportal.web.integration.pages.usermanagement

import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.pages.usermanagement.UserDetailsCsvApiService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.eq

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserDetailsCsvApiServiceTest {

    @Inject
    lateinit var userDetailsCsvApiService: UserDetailsCsvApiService

    lateinit var keycloakService: KeycloakService

    private val userId = "00000000-0000-0000-0000-000000000010"
    private val userFirstName = "First Name 10"
    private val userLastName = "Last Name 10"
    private val userEmail = "user_10@test.sovity.io"
    private val userJobTitle = "Job Title 10"

    @BeforeEach
    fun before() {
        keycloakService = Mockito.mock(KeycloakService::class.java)
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        Mockito.`when`(keycloakService.getUserRoles(eq(userId))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))
    }

    @Test
    fun generateConnectorCsv() {
        // arrange
        val expectedCsvContent = "\"USER ID\",\"Organization Name\",\"Last Name\",\"First Name\",\"Roles\",\"Email\",\"Job Title\",\"Registration Status\"\n" +
            "\"$userId\",\"Dev Organization 3.4\",\"$userLastName\",\"$userFirstName\",\"[USER]\",\"$userEmail\",\"$userJobTitle\",\"PENDING\"\n";

        // act
        val inputStream = userDetailsCsvApiService.generateUserDetailsCsv("MDSL3334C4");
        val content = inputStream.bufferedReader().use { it.readText() }

        // assert
        assertThat(inputStream).isNotNull();
        assertThat(content).isEqualTo(expectedCsvContent)
    }
}
