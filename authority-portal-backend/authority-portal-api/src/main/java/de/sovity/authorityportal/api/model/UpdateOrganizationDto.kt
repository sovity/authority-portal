package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(description = "Information about the Organization.")
class UpdateOrganizationDto(
    @NotBlank(message = "Organization's URL of the organization website cannot be blank")
    @Schema(description = "Organization's URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    val url: String,

    @Schema(description = "Organization description", requiredMode = Schema.RequiredMode.REQUIRED)
    val description: String,

    @Schema(description = "Organization's Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    val businessUnit: String,

    @Schema(description = "Organization's Industry", requiredMode = Schema.RequiredMode.REQUIRED)
    val industry: String,

    @NotBlank(message = "Organization's Address cannot be blank")
    @Schema(description = "Organization's Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val address: String,

    @NotBlank(message = "Organization's Billing Address cannot be blank")
    @Schema(description = "Organization's Billing Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val billingAddress: String,

    @NotBlank(message = "Organization's Main Contact Name cannot be blank")
    @Schema(description = "Organization's Main Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactName: String,

    @NotBlank(message = "Organization's Main Contact Email cannot be blank")
    @Schema(description = "Organization's Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactEmail: String,

    @NotBlank(message = "Organization's Main Contact Phone cannot be blank")
    @Schema(description = "Organization's Main Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactPhone: String,

    @NotBlank(message = "Organization's Tech Contact Name cannot be blank")
    @Schema(description = "Organization's Tech Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactName: String,

    @NotBlank(message = "Organization's Tech Contact Email cannot be blank")
    @Schema(description = "Organization's Tech Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactEmail: String,

    @NotBlank(message = "Organization's Tech Contact Phone cannot be blank")
    @Schema(description = "Organization's Tech Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactPhone: String,
)
