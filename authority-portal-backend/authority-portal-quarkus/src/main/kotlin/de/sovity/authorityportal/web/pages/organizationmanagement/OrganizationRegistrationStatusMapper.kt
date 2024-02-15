package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.organization.OrganizationRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus

fun OrganizationRegistrationStatus.toDto(): OrganizationRegistrationStatusDto = when (this) {
    OrganizationRegistrationStatus.INVITED -> OrganizationRegistrationStatusDto.INVITED
    OrganizationRegistrationStatus.ONBOARDING -> OrganizationRegistrationStatusDto.ONBOARDING
    OrganizationRegistrationStatus.PENDING -> OrganizationRegistrationStatusDto.PENDING
    OrganizationRegistrationStatus.ACTIVE -> OrganizationRegistrationStatusDto.ACTIVE
    OrganizationRegistrationStatus.REJECTED -> OrganizationRegistrationStatusDto.REJECTED
}

fun OrganizationRegistrationStatusDto.toDb(): OrganizationRegistrationStatus = when (this) {
    OrganizationRegistrationStatusDto.INVITED -> OrganizationRegistrationStatus.INVITED
    OrganizationRegistrationStatusDto.ONBOARDING -> OrganizationRegistrationStatus.ONBOARDING
    OrganizationRegistrationStatusDto.PENDING -> OrganizationRegistrationStatus.PENDING
    OrganizationRegistrationStatusDto.ACTIVE -> OrganizationRegistrationStatus.ACTIVE
    OrganizationRegistrationStatusDto.REJECTED -> OrganizationRegistrationStatus.REJECTED
    else -> OrganizationRegistrationStatus.REJECTED
}
