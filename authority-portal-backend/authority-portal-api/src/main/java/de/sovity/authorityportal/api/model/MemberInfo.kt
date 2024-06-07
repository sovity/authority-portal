package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Member information.")
class MemberInfo(
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val userId: String,
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,
    @Schema(description = "Roles of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    val roles: List<UserRoleDto>,
    @Schema(description = "User account status", requiredMode = Schema.RequiredMode.REQUIRED)
    val registrationStatus: UserRegistrationStatusDto,
)
