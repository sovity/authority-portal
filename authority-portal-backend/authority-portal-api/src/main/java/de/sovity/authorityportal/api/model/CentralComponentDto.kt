package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Information of a central dataspace component.")
class CentralComponentDto (
    @field:Schema(description = "Central Component ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val centralComponentId: String,

    @field:Schema(description = "Component Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,

    @field:Schema(description = "Home Page URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val homepageUrl: String?,

    @field:Schema(description = "Endpoint URL", requiredMode = Schema.RequiredMode.REQUIRED)
    val endpointUrl: String,

    @field:Schema(description = "Created By Full Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdByUserFullName: String,

    @field:Schema(description = "Created By Organization Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdByOrgName: String,

    @field:Schema(description = "Created By Organization MDS-ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdByOrgMdsId: String,
)
