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
@Schema(description = "Information for inviting a new organization.")
public class InviteOrganizationRequest {
    @Schema(description = "User: Email address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userEmail;
    @Schema(description = "User: First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userFirstName;
    @Schema(description = "User: Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String userLastName;
    @Schema(description = "Organization: Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgName;
    @Schema(description = "Organization: Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgAddress;
    @Schema(description = "Organization: DUNS number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgDuns;
    @Schema(description = "Organization: URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgUrl;
    @Schema(description = "Organization: Email address for security related issues", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgSecurityEmail;
}
