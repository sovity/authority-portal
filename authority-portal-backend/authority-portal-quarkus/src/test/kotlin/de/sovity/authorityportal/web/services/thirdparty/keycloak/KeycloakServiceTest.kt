package de.sovity.authorityportal.web.services.thirdparty.keycloak

import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.KeycloakUserDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.admin.client.resource.UsersResource
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
    lateinit var userResource: UsersResource

    @BeforeEach
    fun setUp() {
        `when`(keycloak.realm(eq("authority-portal"))).thenReturn(realmResource)
        `when`(realmResource.users()).thenReturn(userResource)
    }

    @Test
    fun testListUsers() {
        // arrange
        val representation = mock(UserRepresentation::class.java)
        `when`(userResource.list()).thenReturn(listOf(representation))
        val expected = mock(KeycloakUserDto::class.java)
        `when`(keycloakUserMapper.buildKeycloakUserDto(representation)).thenReturn(expected)

        // act
        val actual = keycloakService.listUsers()

        // assert
        assertThat(actual).containsExactly(expected)
    }
}


