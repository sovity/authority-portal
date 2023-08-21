package de.sovity.authorityportal.web.services.thirdparty.keycloak

import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.KeycloakUserDto
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.keycloak.admin.client.Keycloak

@ApplicationScoped
class KeycloakService {
    @Inject
    lateinit var keycloak: Keycloak

    @Inject
    lateinit var keycloakUserMapper: KeycloakUserMapper

    fun listUsers(): List<KeycloakUserDto> {
        val users = keycloak.realm("authority-portal").users().list()

        return users.map {
            keycloakUserMapper.buildKeycloakUserDto(it)
        }
    }
}


