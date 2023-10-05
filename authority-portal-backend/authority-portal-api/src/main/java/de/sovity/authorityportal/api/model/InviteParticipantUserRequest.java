package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User information for creating an organization-internal invitation.")
public class InviteParticipantUserRequest {
    @Schema(description = "Email address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;
    @Schema(description = "Participant role", requiredMode = Schema.RequiredMode.REQUIRED)
    private UserRoleDto role;
}
