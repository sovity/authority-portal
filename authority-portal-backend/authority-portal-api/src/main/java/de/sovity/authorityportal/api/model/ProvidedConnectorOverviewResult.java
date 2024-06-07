package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "All data for connector overview page(s).")
public class ProvidedConnectorOverviewResult {
    @Schema(description = "Visible connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    List<ProvidedConnectorOverviewEntryDto> connectors;
}
