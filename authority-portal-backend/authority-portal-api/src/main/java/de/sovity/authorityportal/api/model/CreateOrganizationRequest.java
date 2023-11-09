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
@Schema(description = "Organization object for user registration.")
public class CreateOrganizationRequest {
    @Schema(description = "Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;
    @Schema(description = "Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String address;
    @Schema(description = "Tax Id", requiredMode = Schema.RequiredMode.REQUIRED)
    private String taxId;
    @Schema(description = "URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String url;
    @Schema(description = "Email address for security related issues", requiredMode = Schema.RequiredMode.REQUIRED)
    private String securityEmail;
}
