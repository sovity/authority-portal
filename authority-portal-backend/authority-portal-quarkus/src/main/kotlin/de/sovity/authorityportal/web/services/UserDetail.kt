package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import java.time.OffsetDateTime

data class UserDetail(
    val userId: String,
    val firstName: String?,
    val lastName: String?,
    val email: String,
    val position: String?,
    val phoneNumber: String?,
    val organizationMdsId: String?,
    val registrationStatus: UserRegistrationStatus,
    val createdAt: OffsetDateTime,
    val roles: Set<String>
)
