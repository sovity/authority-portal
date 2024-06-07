package de.sovity.authorityportal.api.model

import de.sovity.authorityportal.api.model.organization.OrganizationLegalIdTypeDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import lombok.AllArgsConstructor
import lombok.Data
import lombok.NoArgsConstructor

@Schema(description = "Information for registering a new user and organization.")
class RegistrationRequestDto(
    @NotBlank(message = "User's Email cannot be blank")
    @Schema(description = "User's Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val userEmail: String,

    @NotBlank(message = "User's First name cannot be blank")
    @Schema(description = "User's First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val userFirstName: String,

    @NotBlank(message = "User's Last name cannot be blank")
    @Schema(description = "User's Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val userLastName: String,

    @NotBlank(message = "User's Job title cannot be blank")
    @Schema(description = "User's Job title", requiredMode = Schema.RequiredMode.REQUIRED)
    val userJobTitle: String,

    @NotBlank(message = "User's Phone number cannot be blank")
    @Schema(description = "User's Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    val userPhone: String,

    @NotBlank(message = "User's Password cannot be blank")
    @Schema(description = "User's Password", requiredMode = Schema.RequiredMode.REQUIRED)
    val userPassword: String,

    @NotBlank(message = "Organization's Legal name cannot be blank")
    @Schema(description = "Organization's Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationName: String,

    @NotBlank(message = "Organization's URL of the organization website cannot be blank")
    @Schema(description = "Organization's URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationUrl: String,

    @Schema(description = "Organization's Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationBusinessUnit: String,

    @Schema(description = "Organization's Industry", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationIndustry: String,

    @NotBlank(message = "Organization's Address cannot be blank")
    @Schema(description = "Organization's Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationAddress: String,

    @NotBlank(message = "Organization's Billing Address cannot be blank")
    @Schema(description = "Organization's Billing Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationBillingAddress: String,

    @Schema(description = "Organization description", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationDescription: String,

    @NotNull(message = "Organization's ID type cannot be null")
    @Schema(description = "Organization's legal ID type", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationLegalIdType: OrganizationLegalIdTypeDto,

    @NotBlank(message = "Organization's legal ID number cannot be blank")
    @Schema(
        description = "Organization's legal ID number - either Tax ID or Commerce register number",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val organizationLegalIdNumber: String,

    @Schema(description = "Organization's Commerce Register Location", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val organizationCommerceRegisterLocation: String?,

    @NotBlank(message = "Organization's Main Contact Name cannot be blank")
    @Schema(description = "Organization's Main Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationMainContactName: String,

    @NotBlank(message = "Organization's Main Contact Email cannot be blank")
    @Schema(description = "Organization's Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationMainContactEmail: String,

    @NotBlank(message = "Organization's Main Contact Phone cannot be blank")
    @Schema(description = "Organization's Main Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationMainContactPhone: String,

    @NotBlank(message = "Organization's Tech Contact Name cannot be blank")
    @Schema(description = "Organization's Tech Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationTechContactName: String,

    @NotBlank(message = "Organization's Tech Contact Email cannot be blank")
    @Schema(description = "Organization's Tech Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationTechContactEmail: String,

    @NotBlank(message = "Organization's Tech Contact Phone cannot be blank")
    @Schema(description = "Organization's Tech Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationTechContactPhone: String,
)
