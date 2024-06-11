package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Information about the user.")
class UserDetailDto(
    @field:Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val userId: String,

    @field:Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,

    @field:Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,

    @field:Schema(description = "Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val email: String,

    @field:Schema(description = "Roles of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    val roles: List<UserRoleDto>,

    @field:Schema(description = "Registration status of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    val registrationStatus: UserRegistrationStatusDto,

    @field:Schema(description = "Creation date of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    val creationDate: OffsetDateTime,

    @field:Schema(description = "Organization MDS ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationMdsId: String,

    @field:Schema(description = "Organization name", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationName: String,

    @field:Schema(description = "Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    val phone: String,

    @field:Schema(description = "Job description", requiredMode = Schema.RequiredMode.REQUIRED)
    val position: String,

    @field:Schema(description = "Onboarding type", requiredMode = Schema.RequiredMode.REQUIRED)
    val onboardingType: UserOnboardingTypeDto,

    @field:Schema(description = "Inviting user's id if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val invitingUserId: String?,

    @field:Schema(description = "Inviting user's first name if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val invitingUserFirstName: String?,

    @field:Schema(description = "Inviting user's last name if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val invitingUserLastName: String?,
)
