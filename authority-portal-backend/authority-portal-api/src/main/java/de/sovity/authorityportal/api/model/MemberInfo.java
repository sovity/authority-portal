package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Member information.")
public class MemberInfo {

    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userId;

    @Schema(description = "E-Mail", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;

    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;

    @Schema(description = "Roles of the user", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<UserRoleDto> roles;
}
