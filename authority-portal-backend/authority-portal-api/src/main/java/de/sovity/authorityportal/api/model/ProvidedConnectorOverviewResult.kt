package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import lombok.AllArgsConstructor
import lombok.Data
import lombok.NoArgsConstructor

@Schema(description = "All data for connector overview page(s).")
class ProvidedConnectorOverviewResult(
    @Schema(description = "Visible connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectors: List<ProvidedConnectorOverviewEntryDto>,
)
