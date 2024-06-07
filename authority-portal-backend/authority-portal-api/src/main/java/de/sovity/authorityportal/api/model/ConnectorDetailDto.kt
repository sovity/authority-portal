package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Detail information about a deployed connector.")
class ConnectorDetailDto(
    @Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorId: String,
    @Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    val type: ConnectorTypeDto,
    @Schema(description = "Owning organization (name)", requiredMode = Schema.RequiredMode.REQUIRED)
    val orgName: String,
    @Schema(description = "Owning organization (MDS-ID)", requiredMode = Schema.RequiredMode.REQUIRED)
    val orgMdsId: String,
    @Schema(description = "Hosting organization (name)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val hostName: String?,
    @Schema(description = "Hosting organization (MDS-ID)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val hostMdsId: String?,
    @Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    val environment: DeploymentEnvironmentDto,
    @Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorName: String,
    @Schema(description = "Location", requiredMode = Schema.RequiredMode.REQUIRED)
    val location: String,
    @Schema(description = "Frontend URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val frontendUrl: String?,
    @Schema(description = "Endpoint URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val endpointUrl: String?,
    @Schema(description = "Management URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val managementUrl: String?,
    @Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    val status: ConnectorStatusDto,
)
