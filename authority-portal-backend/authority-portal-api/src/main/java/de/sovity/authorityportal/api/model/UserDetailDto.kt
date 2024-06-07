package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Information about the user.")
class UserDetailDto(
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val userId: String,

    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,

    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,

    @Schema(description = "Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val email: String,

    @Schema(description = "Roles of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    val roles: List<UserRoleDto>,

    @Schema(description = "Registration status of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    val registrationStatus: UserRegistrationStatusDto,

    @Schema(description = "Creation date of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    val creationDate: OffsetDateTime,

    @Schema(description = "Organization MDS ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationMdsId: String,

    @Schema(description = "Organization name", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationName: String,

    @Schema(description = "Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    val phone: String,

    @Schema(description = "Job description", requiredMode = Schema.RequiredMode.REQUIRED)
    val position: String,

    @Schema(description = "Onboarding type", requiredMode = Schema.RequiredMode.REQUIRED)
    val onboardingType: UserOnboardingTypeDto,

    @Schema(description = "Inviting user's id if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val invitingUserId: String?,

    @Schema(description = "Inviting user's first name if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val invitingUserFirstName: String?,

    @Schema(description = "Inviting user's last name if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val invitingUserLastName: String?,
)
