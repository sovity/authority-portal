package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(description = "Request object for requesting a ready-to-go Connector-as-a-Service")
data class CreateCaasRequest(
    @field:NotBlank(message = "Connector sub-domain cannot be blank")
    @field:Schema(description = "Connector Sub-domain", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorSubdomain: String,

    @field:NotBlank(message = "Connector title cannot be blank")
    @field:Schema(description = "Connector title", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorTitle: String,

    @field:NotBlank(message = "Connector description cannot be blank")
    @field:Schema(description = "Connector description", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorDescription: String,
)
