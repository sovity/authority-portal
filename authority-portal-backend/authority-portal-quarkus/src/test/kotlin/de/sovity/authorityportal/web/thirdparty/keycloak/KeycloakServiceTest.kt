package de.sovity.authorityportal.web.thirdparty.keycloak

import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.admin.client.resource.RoleMappingResource
import org.keycloak.admin.client.resource.RoleScopeResource
import org.keycloak.admin.client.resource.UserResource
import org.keycloak.admin.client.resource.UsersResource
import org.keycloak.representations.idm.RoleRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.mockito.ArgumentMatchers.eq
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.mock
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
        val representation = UserRepresentation().apply { id = userId }
        mockUserResource(representation)
        val expected = mock(KeycloakUserDto::class.java)
        `when`(keycloakUserMapper.buildKeycloakUserDto(representation)).thenReturn(expected)

        // act
        val actual = keycloakService.getUser(userId)

        // assert
        assertThat(actual).isEqualTo(expected)
    }

    @Test
    fun testGetUserRoles() {
        // arrange
        val userId = "123"
        val userResource = mock(UserResource::class.java)
        val roleMappingResource = mock(RoleMappingResource::class.java)
        val roleScopeResource = mock(RoleScopeResource::class.java)
        val role1 = mock(RoleRepresentation::class.java)
        val role2 = mock(RoleRepresentation::class.java)
        `when`(role1.name).thenReturn("UR_AUTHORITY-PORTAL_AUTHORITY-USER")
        `when`(role2.name).thenReturn("UR_AUTHORITY-PORTAL_PARTICIPANT-CURATOR")

        `when`(usersResource.get(eq(userId))).thenReturn(userResource)
        `when`(userResource.roles()).thenReturn(roleMappingResource)
        `when`(roleMappingResource.realmLevel()).thenReturn(roleScopeResource)
        `when`(roleScopeResource.listEffective()).thenReturn(listOf(role1, role2))

        // act
        val userRoles = keycloakService.getUserRoles(userId)

        // assert
        assert(userRoles.contains("UR_AUTHORITY-PORTAL_AUTHORITY-USER"))
        assert(userRoles.contains("UR_AUTHORITY-PORTAL_PARTICIPANT-CURATOR"))
    }

    private fun mockUserResource(representation: UserRepresentation): UserResource {
        val userResource = mock(UserResource::class.java)
        `when`(usersResource.get(eq(representation.id))).thenReturn(userResource)
        `when`(userResource.toRepresentation()).thenReturn(representation)

        return userResource
    }
}


