package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Schema(description = "User information for creating an organization-internal invitation.")
class InviteParticipantUserRequest(
    @NotBlank(message = "Email address cannot be blank")
    @Schema(description = "Email address", requiredMode = Schema.RequiredMode.REQUIRED)
    val email: String,

    @NotBlank(message = "First name cannot be blank")
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,

    @NotBlank(message = "Last name cannot be blank")
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,

    @NotNull(message = "Role cannot be null")
    @Schema(description = "Participant role", requiredMode = Schema.RequiredMode.REQUIRED)
    val role: UserRoleDto,
)
