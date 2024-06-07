package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Uptime information for a single component.")
public class UptimeStatusDto {
    @Schema(description = "Status of the component", requiredMode = Schema.RequiredMode.REQUIRED)
    ComponentStatusDto componentStatus;
    @Schema(description = "Uptime in percent", requiredMode = Schema.RequiredMode.REQUIRED)
    Double uptimePercentage;
    @Schema(description = "Time span used for uptime percentage calculation", requiredMode = Schema.RequiredMode.REQUIRED)
    Long timeSpanSeconds;
    @Schema(description = "Time span since last incident", requiredMode = Schema.RequiredMode.REQUIRED)
    Long upSinceSeconds;
}
