package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Detail information about a deployed connector.")
public class ConnectorDetailDto {
    @Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String connectorId;
    @Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    private ConnectorTypeDto type;
    @Schema(description = "Owning organization (name)", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgName;
    @Schema(description = "Owning organization (MDS-ID)", requiredMode = Schema.RequiredMode.REQUIRED)
    private String orgMdsId;
    @Schema(description = "Hosting organization (name)", requiredMode = Schema.RequiredMode.REQUIRED)
    private String hostName;
    @Schema(description = "Hosting organization (MDS-ID)", requiredMode = Schema.RequiredMode.REQUIRED)
    private String hostMdsId;
    @Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    private DeploymentEnvironmentDto environment;
    @Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String connectorName;
    @Schema(description = "Location", requiredMode = Schema.RequiredMode.REQUIRED)
    private String location;
    @Schema(description = "Frontend URL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String frontendUrl;
    @Schema(description = "Endpoint URL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String endpointUrl;
    @Schema(description = "Management URL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String managementUrl;
}
