package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Visible connector in connector overview page(s).")
public class ProvidedConnectorOverviewEntryDto {
    @Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    String id;
    @Schema(description = "Customer organization name", requiredMode = Schema.RequiredMode.REQUIRED)
    String customerOrgName;
    @Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    ConnectorTypeDto type;
    @Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    DeploymentEnvironmentDto environment;
    @Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    String name;
    @Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    ConnectorStatusDto status;
    @Schema(description = "Frontend link", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    String frontendUrl;
}
