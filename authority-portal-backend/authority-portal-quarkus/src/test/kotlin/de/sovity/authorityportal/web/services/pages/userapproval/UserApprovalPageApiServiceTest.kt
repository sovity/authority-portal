package de.sovity.authorityportal.web.services.pages.userapproval

import de.sovity.authorityportal.api.model.UserApprovalPageQuery
import de.sovity.authorityportal.api.model.UserApprovalPageListEntryDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class UserApprovalPageApiServiceTest {
    @InjectMocks
    lateinit var userApprovalPageApiService: UserApprovalPageApiService

    @Mock
    lateinit var keycloakService: KeycloakService

    @Mock
    lateinit var userApprovalPageUserMapper: UserApprovalPageUserMapper

    @Test
    fun testUserApprovalPage() {
        // arrange
        val query = UserApprovalPageQuery("")
        val pendingUser = mock(KeycloakUserDto::class.java)
        `when`(pendingUser.registrationStatus).thenReturn(UserRegistrationStatus.PENDING)
        val otherUser = mock(KeycloakUserDto::class.java)
        `when`(keycloakService.listUsers()).thenReturn(listOf(pendingUser, otherUser))
        val expected = mock(UserApprovalPageListEntryDto::class.java)
        `when`(userApprovalPageUserMapper.buildUserListEntry(pendingUser)).thenReturn(expected)

        // act
        val actual = userApprovalPageApiService.userApprovalPage(query)

        // assert
        val users = actual.users
        assertThat(users).containsExactly(expected)
    }
}
