package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(description = "Information about the user provided while onboarding.")
class OnboardingUserUpdateDto(
    @NotBlank(message = "First name cannot be blank.")
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,

    @NotBlank(message = "Last name cannot be blank.")
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,

    @NotBlank(message = "Job title cannot be blank.")
    @Schema(description = "Job title", requiredMode = Schema.RequiredMode.REQUIRED)
    val jobTitle: String,

    @NotBlank(message = "Phone number cannot be blank.")
    @Schema(description = "Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    val phoneNumber: String,
)
