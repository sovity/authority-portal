package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Detail information about a deployed connector.")
class ConnectorDetailDto(
    @field:Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorId: String,
    @field:Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    val type: ConnectorTypeDto,
    @field:Schema(description = "Owning organization (name)", requiredMode = Schema.RequiredMode.REQUIRED)
    val orgName: String,
    @field:Schema(description = "Owning organization (MDS-ID)", requiredMode = Schema.RequiredMode.REQUIRED)
    val orgMdsId: String,
    @field:Schema(description = "Hosting organization (name)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val hostName: String?,
    @field:Schema(description = "Hosting organization (MDS-ID)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val hostMdsId: String?,
    @field:Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    val environment: DeploymentEnvironmentDto,
    @field:Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorName: String,
    @field:Schema(description = "Location", requiredMode = Schema.RequiredMode.REQUIRED)
    val location: String,
    @field:Schema(description = "Frontend URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val frontendUrl: String?,
    @field:Schema(description = "Endpoint URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val endpointUrl: String?,
    @field:Schema(description = "Management URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val managementUrl: String?,
    @field:Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    val status: ConnectorStatusDto,
)
