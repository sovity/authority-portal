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
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;
    @Schema(description = "Name of the user's organization", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationName;
    @Schema(description = "MDS-ID of the user's organization", requiredMode = Schema.RequiredMode.REQUIRED)
    private String organizationMdsId;
    @Schema(description = "Roles of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<UserRoleDto> roles;
    @Schema(description = "Registration status of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    private UserRegistrationStatusDto registrationStatus;
}
