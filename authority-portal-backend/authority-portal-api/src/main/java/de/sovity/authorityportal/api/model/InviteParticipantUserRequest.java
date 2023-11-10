package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotBlank(message = "Email address cannot be blank")
    @Schema(description = "Email address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @NotBlank(message = "First name cannot be blank")
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;

    @NotNull(message = "Role cannot be null")
    @Schema(description = "Participant role", requiredMode = Schema.RequiredMode.REQUIRED)
    private UserRoleDto role;
}
