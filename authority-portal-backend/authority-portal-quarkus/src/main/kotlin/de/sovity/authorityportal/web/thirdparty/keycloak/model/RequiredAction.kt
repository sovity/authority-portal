package de.sovity.authorityportal.web.thirdparty.keycloak.model

enum class RequiredAction(val stringRepresentation: String) {
    UPDATE_PASSWORD("UPDATE_PASSWORD"),
    CONFIGURE_TOTP("CONFIGURE_TOTP"),
    VERIFY_EMAIL("VERIFY_EMAIL")
}
