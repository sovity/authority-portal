package de.sovity.authorityportal.web.services.thirdparty.keycloak.model

enum class UserRegistrationStatus(val statusCode: Int) {
    CREATED(0),
    ORGANIZATION_CREATED(100),
    PENDING(200),
    APPROVED(300),
    REJECTED(400),
    UNKNOWN(-1);

    companion object {
        private val byStatusCode = values().associateBy { it.statusCode }
        fun fromStatusCode(statusCode: Int): UserRegistrationStatus = byStatusCode[statusCode] ?: UNKNOWN
    }
}
