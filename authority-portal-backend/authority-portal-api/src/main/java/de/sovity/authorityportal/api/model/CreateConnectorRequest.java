package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Connector object for connector registration.")
public class CreateConnectorRequest {
    @NotBlank(message = "Name cannot be blank")
    @Schema(description = "Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @NotBlank(message = "Location cannot be blank")
    @Schema(description = "Location", requiredMode = Schema.RequiredMode.REQUIRED)
    private String location;

    @NotBlank(message = "URL of the connector frontend cannot be blank")
    @Schema(description = "URL of the connector frontend", requiredMode = Schema.RequiredMode.REQUIRED)
    private String frontendUrl;

    @NotBlank(message = "URL of the connector endpoint cannot be blank")
    @Schema(description = "URL of the connector endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    private String endpointUrl;

    @NotBlank(message = "URL of the connector management endpoint cannot be blank")
    @Schema(description = "URL of the connector management endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    private String managementUrl;

    @NotBlank(message = "Public key of certificate cannot be blank")
    @Schema(description = "Public key of certificate", requiredMode = Schema.RequiredMode.REQUIRED)
    private String certificate;
}
