package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Information about the logged in user.")
class UserInfo(
    @Schema(
        description = "Authentication Status. Is the user logged in or not",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val authenticationStatus: UserAuthenticationStatusDto,

    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val userId: String,

    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,

    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,

    @Schema(description = "Name of the user's organization", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationName: String,

    @Schema(description = "MDS-ID of the user's organization", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationMdsId: String,

    @Schema(description = "Roles of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    val roles: List<UserRoleDto>,

    @Schema(description = "Registration status of the user", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val registrationStatus: UserRegistrationStatusDto?,
)
