package de.sovity.authorityportal.api.model.organization;

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
@Schema(description = "Organization object for user registration.")
public class CreateOrganizationRequest {
    @NotBlank(message = "Name cannot be blank")
    @Schema(description = "Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @NotBlank(message = "Address cannot be blank")
    @Schema(description = "Address", requiredMode = Schema.RequiredMode.REQUIRED)
    private String address;

    @NotBlank(message = "Tax Id cannot be blank")
    @Schema(description = "Tax Id", requiredMode = Schema.RequiredMode.REQUIRED)
    private String taxId;

    @NotBlank(message = "URL cannot be blank")
    @Schema(description = "URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    private String url;

    @NotBlank(message = "Security Email cannot be blank")
    @Schema(description = "Email address for security related issues", requiredMode = Schema.RequiredMode.REQUIRED)
    private String securityEmail;
}
