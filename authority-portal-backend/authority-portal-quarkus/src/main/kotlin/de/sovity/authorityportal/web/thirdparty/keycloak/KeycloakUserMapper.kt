package de.sovity.authorityportal.web.thirdparty.keycloak

import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import jakarta.enterprise.context.ApplicationScoped
import org.keycloak.representations.idm.UserRepresentation

@ApplicationScoped
class KeycloakUserMapper {

    fun buildKeycloakUserDto(user: UserRepresentation) = KeycloakUserDto(
        userId = user.id,
        firstName = user.firstName,
        lastName = user.lastName,
        email = user.email
    )
}


