package de.sovity.authorityportal.web.services.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus

fun UserRegistrationStatus.toDto(): UserRegistrationStatusDto = when (this) {
    UserRegistrationStatus.CREATED -> UserRegistrationStatusDto.CREATED
    UserRegistrationStatus.ORGANIZATION_CREATED -> UserRegistrationStatusDto.ORGANIZATION_CREATED
    UserRegistrationStatus.PENDING -> UserRegistrationStatusDto.PENDING
    UserRegistrationStatus.APPROVED -> UserRegistrationStatusDto.APPROVED
    UserRegistrationStatus.REJECTED -> UserRegistrationStatusDto.REJECTED
    UserRegistrationStatus.UNKNOWN -> UserRegistrationStatusDto.UNKNOWN
}

fun UserRegistrationStatusDto.toKc(): UserRegistrationStatus = when (this) {
    UserRegistrationStatusDto.CREATED -> UserRegistrationStatus.CREATED
    UserRegistrationStatusDto.ORGANIZATION_CREATED -> UserRegistrationStatus.ORGANIZATION_CREATED
    UserRegistrationStatusDto.PENDING -> UserRegistrationStatus.PENDING
    UserRegistrationStatusDto.APPROVED -> UserRegistrationStatus.APPROVED
    UserRegistrationStatusDto.REJECTED -> UserRegistrationStatus.REJECTED
    UserRegistrationStatusDto.UNKNOWN -> UserRegistrationStatus.UNKNOWN
}
