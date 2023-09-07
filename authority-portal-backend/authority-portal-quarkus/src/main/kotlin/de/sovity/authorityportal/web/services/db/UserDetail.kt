package de.sovity.authorityportal.web.services.db

import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus

data class UserDetail(
    val userId: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val position: String?,
    val phoneNumber: String?,
    val organizationMdsId: String?,
    val registrationStatus: UserRegistrationStatus
)
