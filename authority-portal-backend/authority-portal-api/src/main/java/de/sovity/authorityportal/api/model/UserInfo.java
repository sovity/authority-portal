package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Information about the logged in user.")
public class UserInfo {
    @Schema(description = "Authentication Status. Is the user logged in or not", requiredMode = Schema.RequiredMode.REQUIRED)
    UserAuthenticationStatusDto authenticationStatus;
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    String userId;
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    String firstName;
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    String lastName;
    @Schema(description = "Name of the user's organization", requiredMode = Schema.RequiredMode.REQUIRED)
    String organizationName;
    @Schema(description = "MDS-ID of the user's organization", requiredMode = Schema.RequiredMode.REQUIRED)
    String organizationMdsId;
    @Schema(description = "Roles of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    List<UserRoleDto> roles;
    @Schema(description = "Registration status of the user", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    UserRegistrationStatusDto registrationStatus;
}
