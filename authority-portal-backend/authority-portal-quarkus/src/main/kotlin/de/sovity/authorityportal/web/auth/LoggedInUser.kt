package de.sovity.authorityportal.web.auth

data class LoggedInUser(
    val userId: String,
    val organizationMdsId: String?,
    var roles: Set<String>
)

