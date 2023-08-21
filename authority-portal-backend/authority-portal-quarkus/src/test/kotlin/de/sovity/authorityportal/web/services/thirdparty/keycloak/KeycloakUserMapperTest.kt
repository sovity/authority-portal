package de.sovity.authorityportal.web.services.thirdparty.keycloak

import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.keycloak.representations.idm.UserRepresentation
import org.mockito.InjectMocks
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class KeycloakUserMapperTest {
    @InjectMocks
    lateinit var keycloakUserMapper: KeycloakUserMapper

    @Test
    fun testBuildKeycloakUserDto() {
        // arrange
        val user = UserRepresentation().apply {
            id = "userId"
            firstName = "firstName"
            lastName = "lastName"
            email = "email"
            attributes = mapOf(
                "position" to listOf("position"),
                "phoneNumber" to listOf("phoneNumber"),
                "registrationStatus" to listOf("300")
            )
        }

        // act
        val result = keycloakUserMapper.buildKeycloakUserDto(user)

        // assert
        assertThat(result.userId).isEqualTo("userId")
        assertThat(result.firstName).isEqualTo("firstName")
        assertThat(result.lastName).isEqualTo("lastName")
        assertThat(result.email).isEqualTo("email")
        assertThat(result.position).isEqualTo("position")
        assertThat(result.phoneNumber).isEqualTo("phoneNumber")
        assertThat(result.registrationStatus).isEqualTo(UserRegistrationStatus.APPROVED)
    }
}


