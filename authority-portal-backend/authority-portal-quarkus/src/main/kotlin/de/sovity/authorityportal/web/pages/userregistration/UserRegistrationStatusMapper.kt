package de.sovity.authorityportal.web.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus

fun UserRegistrationStatus.toDto(): UserRegistrationStatusDto = when (this) {
    UserRegistrationStatus.INVITED -> UserRegistrationStatusDto.INVITED
    UserRegistrationStatus.ONBOARDING -> UserRegistrationStatusDto.ONBOARDING
    UserRegistrationStatus.PENDING -> UserRegistrationStatusDto.PENDING
    UserRegistrationStatus.ACTIVE -> UserRegistrationStatusDto.ACTIVE
    UserRegistrationStatus.REJECTED -> UserRegistrationStatusDto.REJECTED
    UserRegistrationStatus.DEACTIVATED -> UserRegistrationStatusDto.DEACTIVATED
    else -> UserRegistrationStatusDto.REJECTED
}

fun UserRegistrationStatusDto.toDb(): UserRegistrationStatus = when (this) {
    UserRegistrationStatusDto.INVITED -> UserRegistrationStatus.INVITED
    UserRegistrationStatusDto.ONBOARDING -> UserRegistrationStatus.ONBOARDING
    UserRegistrationStatusDto.PENDING -> UserRegistrationStatus.PENDING
    UserRegistrationStatusDto.ACTIVE -> UserRegistrationStatus.ACTIVE
    UserRegistrationStatusDto.REJECTED -> UserRegistrationStatus.REJECTED
    UserRegistrationStatusDto.DEACTIVATED -> UserRegistrationStatus.DEACTIVATED
    else -> UserRegistrationStatus.REJECTED
}
