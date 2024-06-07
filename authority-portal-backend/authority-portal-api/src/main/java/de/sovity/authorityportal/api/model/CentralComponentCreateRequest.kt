package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(description = "Information for registering a new central dataspace component.")
class CentralComponentCreateRequest(
    @field:Schema(description = "Component Name", requiredMode = Schema.RequiredMode.REQUIRED)
    @field:NotBlank(message = "Name of component cannot be blank")
    val name: String,

    @field:Schema(description = "Home Page URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val homepageUrl: String?,

    @field:Schema(description = "Endpoint URL", requiredMode = Schema.RequiredMode.REQUIRED)
    @field:NotBlank(message = "Endpoint URL cannot be blank")
    val endpointUrl:  String,

    @field:Schema(description = "The component's certificate", requiredMode = Schema.RequiredMode.REQUIRED)
    @field:NotBlank(message = "Certificate cannot be blank")
    val certificate: String
)
