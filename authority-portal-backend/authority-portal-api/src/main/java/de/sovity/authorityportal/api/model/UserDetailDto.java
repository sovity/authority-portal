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
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;
    @Schema(description = "Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;
    @Schema(description = "Roles of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<UserRoleDto> roles;
    @Schema(description = "Registration status of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    private UserRegistrationStatusDto registrationStatus;
    @Schema(description = "Creation date of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    private OffsetDateTime creationDate;
    @Schema(description = "Organization name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationName;
    @Schema(description = "Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String phone;
    @Schema(description = "Job description", requiredMode = Schema.RequiredMode.REQUIRED)
    private String position;
    @Schema(description = "Onboarding type", requiredMode = Schema.RequiredMode.REQUIRED)
    private UserOnboardingTypeDto onboardingType;
    @Schema(description = "Inviting user's id if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String invitingUserId;
    @Schema(description = "Inviting user's first name if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String invitingUserFirstName;
    @Schema(description = "Inviting user's last name if applicable", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String invitingUserLastName;
}
