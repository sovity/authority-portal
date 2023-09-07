package de.sovity.authorityportal.web.services.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus

fun UserRegistrationStatus.toDto(): UserRegistrationStatusDto = when (this) {
    UserRegistrationStatus.CREATED -> UserRegistrationStatusDto.CREATED
    UserRegistrationStatus.PENDING -> UserRegistrationStatusDto.PENDING
    UserRegistrationStatus.APPROVED -> UserRegistrationStatusDto.APPROVED
    UserRegistrationStatus.REJECTED -> UserRegistrationStatusDto.REJECTED
}

fun UserRegistrationStatusDto.toDb(): UserRegistrationStatus = when (this) {
    UserRegistrationStatusDto.CREATED -> UserRegistrationStatus.CREATED
    UserRegistrationStatusDto.PENDING -> UserRegistrationStatus.PENDING
    UserRegistrationStatusDto.APPROVED -> UserRegistrationStatus.APPROVED
    UserRegistrationStatusDto.REJECTED -> UserRegistrationStatus.REJECTED
    else -> UserRegistrationStatus.REJECTED
}
