package de.sovity.authorityportal.web.services.thirdparty.keycloak

import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakUserMapper.Companion.REGISTRATION_STATUS
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.keycloak.admin.client.Keycloak

@ApplicationScoped
class KeycloakService {
    @Inject
    lateinit var keycloak: Keycloak

    @Inject
    lateinit var keycloakUserMapper: KeycloakUserMapper

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    lateinit var keycloakRealm: String

    fun listUsers(): List<KeycloakUserDto> {
        val users = keycloak.realm(keycloakRealm).users().list()

        return users.map {
            keycloakUserMapper.buildKeycloakUserDto(it)
        }
    }

    fun getUser(userId: String): KeycloakUserDto {
        // TODO: handle not found (maybe try/catch => User?)
        val user = keycloak.realm(keycloakRealm).users().get(userId).toRepresentation()

        return keycloakUserMapper.buildKeycloakUserDto(user)
    }

    fun updateStatus(userId: String, status: UserRegistrationStatus) {
        val user = keycloak.realm(keycloakRealm).users().get(userId).toRepresentation()
        user.attributes[REGISTRATION_STATUS] = listOf(status.statusCode.toString())
        keycloak.realm(keycloakRealm).users().get(userId).update(user)
    }
}


