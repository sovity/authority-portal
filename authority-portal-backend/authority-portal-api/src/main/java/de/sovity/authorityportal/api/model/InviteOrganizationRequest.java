package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Information for inviting a new organization.")
public class InviteOrganizationRequest {
    @NotBlank(message = "User email cannot be blank")
    @Schema(description = "User: Email address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userEmail;

    @NotBlank(message = "User first name cannot be blank")
    @Schema(description = "User: First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userFirstName;

    @NotBlank(message = "User last name cannot be blank")
    @Schema(description = "User: Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userLastName;

    @NotBlank(message = "Organization name cannot be blank")
    @Schema(description = "Organization: Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgName;

    @Schema(description = "User job title", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String userJobTitle;

    @Schema(description = "User phone number", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String userPhoneNumber;
}
