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
@Schema(description = "Connector deployment environment.")
public class DeploymentEnvironmentDto {
    @Schema(description = "Deployment environment ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String environmentId;
    @Schema(description = "Environment localized name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;
    @Schema(description = "DAPS Token URL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String dapsTokenUrl;
    @Schema(description = "DAPS JWKS URL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String dapsJwksUrl;
    @Schema(description = "Logging House URL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String loggingHouseUrl;
}
