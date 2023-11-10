package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "Organization address cannot be blank")
    @Schema(description = "Organization: Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgAddress;

    @NotBlank(message = "Organization DUNS number cannot be blank")
    @Schema(description = "Organization: DUNS number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgDuns;

    @NotBlank(message = "Organization URL cannot be blank")
    @Schema(description = "Organization: URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgUrl;

    @NotBlank(message = "Organization security email cannot be blank")
    @Schema(description = "Organization: Email address for security related issues", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgSecurityEmail;
}
