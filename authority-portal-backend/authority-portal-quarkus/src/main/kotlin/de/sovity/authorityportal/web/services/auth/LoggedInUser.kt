package de.sovity.authorityportal.web.services.auth

data class LoggedInUser(
    val userId: String,
    val organizationMdsId: String?,
    var roles: Set<String>
)

