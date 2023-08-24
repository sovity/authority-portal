package de.sovity.authorityportal.web.services.thirdparty.keycloak

import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakUserMapper.Companion.REGISTRATION_STATUS
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.admin.client.resource.UserResource
import org.keycloak.admin.client.resource.UsersResource
import org.keycloak.representations.idm.UserRepresentation
import org.mockito.ArgumentCaptor
import org.mockito.ArgumentMatchers.eq
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension


@ExtendWith(MockitoExtension::class)
class KeycloakServiceTest {
    @InjectMocks
    lateinit var keycloakService: KeycloakService

    @Mock
    lateinit var keycloak: Keycloak

    @Mock
    lateinit var keycloakUserMapper: KeycloakUserMapper

    @Mock
    lateinit var realmResource: RealmResource

    @Mock
    lateinit var usersResource: UsersResource

    @BeforeEach
    fun setUp() {
        `when`(keycloak.realm(eq("authority-portal"))).thenReturn(realmResource)
        `when`(realmResource.users()).thenReturn(usersResource)
        keycloakService.keycloakRealm = "authority-portal"
    }

    @Test
    fun testListUsers() {
        // arrange
        val representation = mock(UserRepresentation::class.java)
        `when`(usersResource.list()).thenReturn(listOf(representation))
        val expected = mock(KeycloakUserDto::class.java)
        `when`(keycloakUserMapper.buildKeycloakUserDto(representation)).thenReturn(expected)

        // act
        val actual = keycloakService.listUsers()

        // assert
        assertThat(actual).containsExactly(expected)
    }

    @Test
    fun testGetUser() {
        // arrange
        val userId = "123"
        val representation = user(userId)
        mockUserResource(representation)
        val expected = mock(KeycloakUserDto::class.java)
        `when`(keycloakUserMapper.buildKeycloakUserDto(representation)).thenReturn(expected)

        // act
        val actual = keycloakService.getUser(userId)

        // assert
        assertThat(actual).isEqualTo(expected)
    }

    @Test
    fun testUpdateStatus() {
        // arrange
        val userId = "123"
        val statusApproved = UserRegistrationStatus.APPROVED
        val userResource = mockUserResource(user(userId))

        //act
        keycloakService.updateStatus(userId, statusApproved)

        //assert
        val actual: ArgumentCaptor<UserRepresentation> = ArgumentCaptor.forClass(UserRepresentation::class.java)
        verify(userResource).update(actual.capture())
        assertThat(actual.value.attributes[REGISTRATION_STATUS]).isEqualTo(listOf(statusApproved.statusCode.toString()))
    }

    private fun mockUserResource(representation: UserRepresentation): UserResource {
        val userResource = mock(UserResource::class.java)
        `when`(usersResource.get(eq(representation.id))).thenReturn(userResource)
        `when`(userResource.toRepresentation()).thenReturn(representation)

        return userResource
    }

    private fun user(userId: String): UserRepresentation {
        return UserRepresentation().apply {
            id = userId
            attributes = mutableMapOf(REGISTRATION_STATUS to listOf(UserRegistrationStatus.PENDING.statusCode.toString()))
        }
    }
}


