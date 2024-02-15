package de.sovity.authorityportal.api.model;

import de.sovity.authorityportal.api.model.organization.ConnectorStatusDto;
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
    private String id;
    @Schema(description = "Customer organization name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String customerOrgName;
    @Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    private ConnectorTypeDto type;
    @Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    private DeploymentEnvironmentDto environment;
    @Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;
    @Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    private ConnectorStatusDto status;
}
