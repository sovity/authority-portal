package de.sovity.authorityportal.api.model.organization

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "All data for organization overview page.")
class OrganizationOverviewResult(
    @Schema(description = "Visible organizations.", requiredMode = Schema.RequiredMode.REQUIRED)
    var organizations: List<OrganizationOverviewEntryDto>
)

