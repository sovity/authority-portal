package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(description = "Information for inviting a new organization.")
class InviteOrganizationRequest(
    @NotBlank(message = "User email cannot be blank")
    @Schema(description = "User: Email address", requiredMode = Schema.RequiredMode.REQUIRED)
    val userEmail: String,

    @NotBlank(message = "User first name cannot be blank")
    @Schema(description = "User: First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val userFirstName: String,

    @NotBlank(message = "User last name cannot be blank")
    @Schema(description = "User: Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val userLastName: String,

    @NotBlank(message = "Organization name cannot be blank")
    @Schema(description = "Organization: Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    val orgName: String,

    @Schema(description = "User job title", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val userJobTitle: String?,

    @Schema(description = "User phone number", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val userPhoneNumber: String?,
)
