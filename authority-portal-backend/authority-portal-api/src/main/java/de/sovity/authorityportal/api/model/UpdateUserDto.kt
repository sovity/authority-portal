package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(description = "Information about the user.")
class UpdateUserDto(
    @Schema(description = "User's First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,

    @NotBlank(message = "User's Last name cannot be blank")
    @Schema(description = "User's Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,

    @NotBlank(message = "User's Job title cannot be blank")
    @Schema(description = "User's Job title", requiredMode = Schema.RequiredMode.REQUIRED)
    val jobTitle: String,

    @NotBlank(message = "User's Phone number cannot be blank")
    @Schema(description = "User's Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    val phone: String,

    @NotBlank(message = "User's email cannot be blank")
    @Schema(description = "User's email", requiredMode = Schema.RequiredMode.REQUIRED)
    val email: String,
)