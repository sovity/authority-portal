package de.sovity.authorityportal.api.model.organization

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Visible organization in organization overview page.")
class OrganizationOverviewEntryDto(
    @Schema(description = "MDS-ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val mdsId: String,

    @Schema(description = "Legal Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,

    @Schema(description = "Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactEmail: String,

    @Schema(description = "Number of Users", requiredMode = Schema.RequiredMode.REQUIRED)
    val numberOfUsers: Int,

    @Schema(description = "Number of Connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val numberOfConnectors: Int,

    @Schema(description = "Number of Data Offers", requiredMode = Schema.RequiredMode.REQUIRED)
    val numberOfDataOffers: Int,

    @Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    val registrationStatus: OrganizationRegistrationStatusDto,
)
