package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Status information for components and connectors.")
class ComponentStatusOverview(
    @Schema(description = "Broker Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val brokerStatus: UptimeStatusDto?,
    @Schema(description = "DAPS Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val dapsStatus: UptimeStatusDto?,
    @Schema(description = "Logging House Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val loggingHouseStatus: UptimeStatusDto?,
    @Schema(description = "Number of online connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val onlineConnectors: Int,
    @Schema(description = "Number of disturbed connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val disturbedConnectors: Int,
    @Schema(description = "Number of offline connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val offlineConnectors: Int,
)
