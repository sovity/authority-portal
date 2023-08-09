package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Visible user in user approval page.")
public class UserListEntryDto {
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userId;
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;
    @Schema(description = "Creation date", requiredMode = Schema.RequiredMode.REQUIRED)
    private OffsetDateTime createdAt;
    @Schema(description = "Role", requiredMode = Schema.RequiredMode.REQUIRED)
    private UserRoleDto role;
}

