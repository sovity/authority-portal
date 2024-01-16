package de.sovity.authorityportal.web.thirdparty.keycloak.model

data class KeycloakUserDto(
    val userId: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val position: String?,
    val phoneNumber: String?
)
