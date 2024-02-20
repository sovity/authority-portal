package de.sovity.authorityportal.web.auth

data class LoggedInUser(
    val authenticated: Boolean,
    val userId: String,
    val organizationMdsId: String?,
    var roles: Set<String>
)

