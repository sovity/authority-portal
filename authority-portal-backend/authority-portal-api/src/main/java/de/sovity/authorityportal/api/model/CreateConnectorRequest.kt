package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(description = "Connector object for connector registration.")
class CreateConnectorRequest(
    @NotBlank(message = "Name cannot be blank")
    @Schema(description = "Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,

    @NotBlank(message = "Location cannot be blank")
    @Schema(description = "Location", requiredMode = Schema.RequiredMode.REQUIRED)
    val location: String,

    @NotBlank(message = "URL of the connector frontend cannot be blank")
    @Schema(description = "URL of the connector frontend", requiredMode = Schema.RequiredMode.REQUIRED)
    val frontendUrl: String,

    @NotBlank(message = "URL of the connector endpoint cannot be blank")
    @Schema(description = "URL of the connector endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    val endpointUrl: String,

    @NotBlank(message = "URL of the connector management endpoint cannot be blank")
    @Schema(description = "URL of the connector management endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    val managementUrl: String,

    @NotBlank(message = "Public key of certificate cannot be blank")
    @Schema(description = "Public key of certificate", requiredMode = Schema.RequiredMode.REQUIRED)
    val certificate: String,
)
