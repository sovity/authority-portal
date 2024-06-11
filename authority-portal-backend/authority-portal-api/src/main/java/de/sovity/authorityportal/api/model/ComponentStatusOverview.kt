package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Status information for components and connectors.")
class ComponentStatusOverview(
    @field:Schema(description = "Broker Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val brokerStatus: UptimeStatusDto?,
    @field:Schema(description = "DAPS Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val dapsStatus: UptimeStatusDto?,
    @field:Schema(description = "Logging House Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val loggingHouseStatus: UptimeStatusDto?,
    @field:Schema(description = "Number of online connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val onlineConnectors: Int,
    @field:Schema(description = "Number of disturbed connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val disturbedConnectors: Int,
    @field:Schema(description = "Number of offline connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val offlineConnectors: Int,
)
