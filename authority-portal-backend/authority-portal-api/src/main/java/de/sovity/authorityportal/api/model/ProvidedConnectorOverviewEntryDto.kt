package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import lombok.AllArgsConstructor
import lombok.Data
import lombok.NoArgsConstructor

@Schema(description = "Visible connector in connector overview page(s).")
class ProvidedConnectorOverviewEntryDto(
    @Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val id: String,
    @Schema(description = "Customer organization name", requiredMode = Schema.RequiredMode.REQUIRED)
    val customerOrgName: String,
    @Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    val type: ConnectorTypeDto,
    @Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    val environment: DeploymentEnvironmentDto,
    @Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,
    @Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    val status: ConnectorStatusDto,
    @Schema(description = "Frontend link", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val frontendUrl: String,
)
