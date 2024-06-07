package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Visible connector in connector overview page(s).")
class ConnectorOverviewEntryDto(
    @Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val id: String,
    @Schema(description = "Host Name", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val hostName: String?,
    @Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    val type: ConnectorTypeDto,
    @Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    val environment: DeploymentEnvironmentDto,
    @Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,
    @Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    val status: ConnectorStatusDto,
    @Schema(description = "Frontend link", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val frontendUrl: String?,
)
