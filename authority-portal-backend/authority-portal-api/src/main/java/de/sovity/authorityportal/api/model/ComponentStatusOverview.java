package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Status information for components and connectors.")
public class ComponentStatusOverview {
    @Schema(description = "Broker Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private UptimeStatusDto brokerStatus;
    @Schema(description = "DAPS Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private UptimeStatusDto dapsStatus;
    @Schema(description = "Logging House Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private UptimeStatusDto loggingHouseStatus;
    @Schema(description = "Number of online connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer onlineConnectors;
    @Schema(description = "Number of disturbed connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer disturbedConnectors;
    @Schema(description = "Number of offline connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer offlineConnectors;
}

