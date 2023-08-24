package de.sovity.authorityportal.web.services.auth

/**
 * Limit visibility of data depending on the role of the user.
 */
data class UserView(
    val filter: UserViewFilter,
    val userId: String,
    val organisationId: String?
)

