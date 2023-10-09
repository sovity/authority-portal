package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.OrganizationRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus

fun OrganizationRegistrationStatus.toDto(): OrganizationRegistrationStatusDto = when (this) {
    OrganizationRegistrationStatus.INVITED -> OrganizationRegistrationStatusDto.INVITED
    OrganizationRegistrationStatus.PENDING -> OrganizationRegistrationStatusDto.PENDING
    OrganizationRegistrationStatus.ACTIVE -> OrganizationRegistrationStatusDto.ACTIVE
    OrganizationRegistrationStatus.REJECTED -> OrganizationRegistrationStatusDto.REJECTED
}

fun OrganizationRegistrationStatusDto.toDb(): OrganizationRegistrationStatus = when (this) {
    OrganizationRegistrationStatusDto.INVITED -> OrganizationRegistrationStatus.INVITED
    OrganizationRegistrationStatusDto.PENDING -> OrganizationRegistrationStatus.PENDING
    OrganizationRegistrationStatusDto.ACTIVE -> OrganizationRegistrationStatus.ACTIVE
    OrganizationRegistrationStatusDto.REJECTED -> OrganizationRegistrationStatus.REJECTED
    else -> OrganizationRegistrationStatus.REJECTED
}
