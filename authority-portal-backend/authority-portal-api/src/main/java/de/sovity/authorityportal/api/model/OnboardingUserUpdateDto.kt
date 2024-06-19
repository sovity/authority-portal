package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(description = "Information about the user provided while onboarding.")
data class OnboardingUserUpdateDto(
    @field:NotBlank(message = "First name cannot be blank.")
    @field:Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,

    @field:NotBlank(message = "Last name cannot be blank.")
    @field:Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,

    @field:NotBlank(message = "Job title cannot be blank.")
    @field:Schema(description = "Job title", requiredMode = Schema.RequiredMode.REQUIRED)
    val jobTitle: String,

    @field:NotBlank(message = "Phone number cannot be blank.")
    @field:Schema(description = "Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    val phoneNumber: String,
)
