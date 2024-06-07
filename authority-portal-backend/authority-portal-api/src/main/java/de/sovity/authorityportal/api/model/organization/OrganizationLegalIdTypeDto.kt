package de.sovity.authorityportal.api.model.organization

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Possible organization ID types", enumAsRef = true)
enum class OrganizationLegalIdTypeDto {
    TAX_ID,
    COMMERCE_REGISTER_INFO
}
