package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Information for registering a new central dataspace component.")
public class CentralComponentCreateRequest {
    @NotBlank(message = "Name of component cannot be blank")
    @Schema(description = "Component Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Schema(description = "Home Page URL")
    private String homepageUrl;

    @NotBlank(message = "Endpoint URL cannot be blank")
    @Schema(description = "Endpoint URL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String endpointUrl;

    @NotBlank(message = "Certificate cannot be blank")
    @Schema(description = "The component's certificate", requiredMode = Schema.RequiredMode.REQUIRED)
    private String certificate;
}
