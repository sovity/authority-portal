package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for requesting a ready-to-go Connector-as-a-Service")
public class CreateCaasRequest {

    @NotBlank(message = "Connector sub-domain cannot be blank")
    @Schema(description = "Connector Sub-domain", requiredMode = Schema.RequiredMode.REQUIRED)
    private String connectorSubdomain;

    @NotBlank(message = "Connector title cannot be blank")
    @Schema(description = "Connector title", requiredMode = Schema.RequiredMode.REQUIRED)
    private String connectorTitle;

    @NotBlank(message = "Connector description cannot be blank")
    @Schema(description = "Connector description", requiredMode = Schema.RequiredMode.REQUIRED)
    private String connectorDescription;
}
