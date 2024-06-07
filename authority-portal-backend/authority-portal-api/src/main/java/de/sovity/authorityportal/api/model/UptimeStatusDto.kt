package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Uptime information for a single component.")
class UptimeStatusDto(
    @Schema(description = "Status of the component", requiredMode = Schema.RequiredMode.REQUIRED)
    val componentStatus: ComponentStatusDto,
    @Schema(description = "Uptime in percent", requiredMode = Schema.RequiredMode.REQUIRED)
    val uptimePercentage: Double,
    @Schema(
        description = "Time span used for uptime percentage calculation",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val timeSpanSeconds: Long,
    @Schema(description = "Time span since last incident", requiredMode = Schema.RequiredMode.REQUIRED)
    val upSinceSeconds: Long,
)
