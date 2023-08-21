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
@Schema(description = "Visible user in user approval page.")
public class UserApprovalPageListEntryDto {
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userId;
    @Schema(description = "Email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;
    @Schema(description = "Position", requiredMode = Schema.RequiredMode.REQUIRED)
    private String position;
    @Schema(description = "Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String phoneNumber;
}
