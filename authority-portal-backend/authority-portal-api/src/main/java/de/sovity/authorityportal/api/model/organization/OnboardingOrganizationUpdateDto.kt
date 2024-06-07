package de.sovity.authorityportal.api.model.organization

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Schema(description = "Information about the organization provided while onboarding.")
class OnboardingOrganizationUpdateDto(
    @NotBlank(message = "Name cannot be blank.")
    @Schema(description = "Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,

    @Schema(description = "Organization description", requiredMode = Schema.RequiredMode.REQUIRED)
    val description: String,

    @NotBlank(message = "Website cannot be blank.")
    @Schema(description = "Website", requiredMode = Schema.RequiredMode.REQUIRED)
    val url: String,

    @Schema(description = "Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    val businessUnit: String,

    @Schema(description = "Industry", requiredMode = Schema.RequiredMode.REQUIRED)
    val industry: String,

    @NotBlank(message = "Address cannot be blank.")
    @Schema(description = "Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val address: String,

    @NotBlank(message = "Billing address cannot be blank.")
    @Schema(description = "Billing address", requiredMode = Schema.RequiredMode.REQUIRED)
    val billingAddress: String,

    @NotNull(message = "Legal identification type cannot be null")
    @Schema(description = "Legal identification type", requiredMode = Schema.RequiredMode.REQUIRED)
    val legalIdType: OrganizationLegalIdTypeDto,

    @NotBlank(message = "Legal identification number cannot be blank")
    @Schema(description = "Legal identification number", requiredMode = Schema.RequiredMode.REQUIRED)
    val legalIdNumber: String,

    @Schema(description = "Commerce register location", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val commerceRegisterLocation: String?,

    @NotBlank(message = "Main contact name cannot be blank")
    @Schema(description = "Main contact name", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactName: String,

    @NotBlank(message = "Main contact email cannot be blank")
    @Schema(description = "Main contact email", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactEmail: String,

    @NotBlank(message = "Main contact phone cannot be blank")
    @Schema(description = "Main contact phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactPhone: String,

    @NotBlank(message = "Technical contact name cannot be blank")
    @Schema(description = "Technical contact name", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactName: String,

    @NotBlank(message = "Technical contact email cannot be blank")
    @Schema(description = "Technical contact email", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactEmail: String,

    @NotBlank(message = "Technical contact phone cannot be blank")
    @Schema(description = "Technical contact phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactPhone: String,
)
