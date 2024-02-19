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
@Schema(description = "Visible connector in connector overview page(s).")
public class ConnectorOverviewEntryDto {
    @Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String id;
    @Schema(description = "Host Name", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String hostName;
    @Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    private ConnectorTypeDto type;
    @Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    private DeploymentEnvironmentDto environment;
    @Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;
    @Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    private ConnectorStatusDto status;
}
