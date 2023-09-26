package de.sovity.authorityportal.web.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus

fun UserRegistrationStatus.toDto(): UserRegistrationStatusDto = when (this) {
    UserRegistrationStatus.FIRST_USER -> UserRegistrationStatusDto.FIRST_USER
    UserRegistrationStatus.CREATED -> UserRegistrationStatusDto.CREATED
    UserRegistrationStatus.PENDING -> UserRegistrationStatusDto.PENDING
    UserRegistrationStatus.APPROVED -> UserRegistrationStatusDto.APPROVED
    UserRegistrationStatus.REJECTED -> UserRegistrationStatusDto.REJECTED
}

fun UserRegistrationStatusDto.toDb(): UserRegistrationStatus = when (this) {
    UserRegistrationStatusDto.FIRST_USER -> UserRegistrationStatus.FIRST_USER
    UserRegistrationStatusDto.CREATED -> UserRegistrationStatus.CREATED
    UserRegistrationStatusDto.PENDING -> UserRegistrationStatus.PENDING
    UserRegistrationStatusDto.APPROVED -> UserRegistrationStatus.APPROVED
    UserRegistrationStatusDto.REJECTED -> UserRegistrationStatus.REJECTED
    else -> UserRegistrationStatus.REJECTED
}
