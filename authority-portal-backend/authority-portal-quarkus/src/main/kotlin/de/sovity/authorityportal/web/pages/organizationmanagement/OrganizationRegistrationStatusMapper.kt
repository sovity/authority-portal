package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.OrganizationRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus

fun OrganizationRegistrationStatus.toDto(): OrganizationRegistrationStatusDto = when (this) {
    OrganizationRegistrationStatus.PENDING -> OrganizationRegistrationStatusDto.PENDING
    OrganizationRegistrationStatus.APPROVED -> OrganizationRegistrationStatusDto.APPROVED
    OrganizationRegistrationStatus.REJECTED -> OrganizationRegistrationStatusDto.REJECTED
}

fun OrganizationRegistrationStatusDto.toDb(): OrganizationRegistrationStatus = when (this) {
    OrganizationRegistrationStatusDto.PENDING -> OrganizationRegistrationStatus.PENDING
    OrganizationRegistrationStatusDto.APPROVED -> OrganizationRegistrationStatus.APPROVED
    OrganizationRegistrationStatusDto.REJECTED -> OrganizationRegistrationStatus.REJECTED
    else -> OrganizationRegistrationStatus.REJECTED
}
