package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Connector deployment environment.")
class DeploymentEnvironmentDto(
    @Schema(description = "Deployment environment ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val environmentId: String,
    @Schema(description = "Environment localized name", requiredMode = Schema.RequiredMode.REQUIRED)
    val title: String,
    @Schema(description = "DAPS Token URL", requiredMode = Schema.RequiredMode.REQUIRED)
    val dapsTokenUrl: String,
    @Schema(description = "DAPS JWKS URL", requiredMode = Schema.RequiredMode.REQUIRED)
    val dapsJwksUrl: String,
    @Schema(description = "Logging House URL", requiredMode = Schema.RequiredMode.REQUIRED)
    val loggingHouseUrl: String,
)
