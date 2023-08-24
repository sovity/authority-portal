package de.sovity.authorityportal.web.services.thirdparty.keycloak

import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import jakarta.enterprise.context.ApplicationScoped
import org.keycloak.representations.idm.UserRepresentation

@ApplicationScoped
class KeycloakUserMapper {
    companion object {
        const val REGISTRATION_STATUS = "registrationStatus"
    }

    fun buildKeycloakUserDto(user: UserRepresentation) = KeycloakUserDto(
        userId = user.id,
        firstName = user.firstName,
        lastName = user.lastName,
        email = user.email,
        position = getString(user, "position"),
        phoneNumber = getString(user, "phoneNumber"),
        registrationStatus = UserRegistrationStatus.fromStatusCode(
            getString(user, REGISTRATION_STATUS)?.toInt() ?: -1
        )
    )

    private fun getString(user: UserRepresentation, key: String): String? = user.attributes[key]?.get(0)
}


