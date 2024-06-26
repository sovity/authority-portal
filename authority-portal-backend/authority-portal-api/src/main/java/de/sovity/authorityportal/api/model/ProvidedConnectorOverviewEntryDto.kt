package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Visible connector in connector overview page(s).")
data class ProvidedConnectorOverviewEntryDto(
    @field:Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val id: String,
    @field:Schema(description = "Customer organization name", requiredMode = Schema.RequiredMode.REQUIRED)
    val customerOrgName: String,
    @field:Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    val type: ConnectorTypeDto,
    @field:Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    val environment: DeploymentEnvironmentDto,
    @field:Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,
    @field:Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    val status: ConnectorStatusDto,
    @field:Schema(description = "Frontend link", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val frontendUrl: String,
)
