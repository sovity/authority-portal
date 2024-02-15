package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.organization.OrganizationLegalIdTypeDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationLegalIdType

fun OrganizationLegalIdType.toDto(): OrganizationLegalIdTypeDto = when (this) {
    OrganizationLegalIdType.TAX_ID -> OrganizationLegalIdTypeDto.TAX_ID
    OrganizationLegalIdType.COMMERCE_REGISTER_INFO -> OrganizationLegalIdTypeDto.COMMERCE_REGISTER_INFO
}

fun OrganizationLegalIdTypeDto.toDb(): OrganizationLegalIdType = when (this) {
    OrganizationLegalIdTypeDto.TAX_ID -> OrganizationLegalIdType.TAX_ID
    OrganizationLegalIdTypeDto.COMMERCE_REGISTER_INFO -> OrganizationLegalIdType.COMMERCE_REGISTER_INFO
}
