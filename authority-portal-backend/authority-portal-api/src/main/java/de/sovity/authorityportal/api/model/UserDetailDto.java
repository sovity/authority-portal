package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Information about the user.")
public class UserDetailDto {
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    String userId;
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    String firstName;
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    String lastName;
    @Schema(description = "Email", requiredMode = Schema.RequiredMode.REQUIRED)
    String email;
    @Schema(description = "Roles of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    List<UserRoleDto> roles;
    @Schema(description = "Registration status of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    UserRegistrationStatusDto registrationStatus;
    @Schema(description = "Creation date of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    OffsetDateTime creationDate;
    @Schema(description = "Organization MDS ID", requiredMode = Schema.RequiredMode.REQUIRED)
    String organizationMdsId;
    @Schema(description = "Organization name", requiredMode = Schema.RequiredMode.REQUIRED)
    String organizationName;
    @Schema(description = "Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    String phone;
    @Schema(description = "Job description", requiredMode = Schema.RequiredMode.REQUIRED)
    String position;
    @Schema(description = "Onboarding type", requiredMode = Schema.RequiredMode.REQUIRED)
    UserOnboardingTypeDto onboardingType;
    @Schema(description = "Inviting user's id if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    String invitingUserId;
    @Schema(description = "Inviting user's first name if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    String invitingUserFirstName;
    @Schema(description = "Inviting user's last name if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    String invitingUserLastName;
}
