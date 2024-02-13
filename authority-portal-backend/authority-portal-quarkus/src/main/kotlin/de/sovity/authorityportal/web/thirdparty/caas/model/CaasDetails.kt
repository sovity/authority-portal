package de.sovity.authorityportal.web.thirdparty.caas.model

import io.swagger.v3.oas.annotations.media.Schema
import lombok.AllArgsConstructor
import lombok.Data
import lombok.NoArgsConstructor

@Data
@NoArgsConstructor
@AllArgsConstructor
class CaasDetails (
    @Schema(description = "Connector's ID", requiredMode = Schema.RequiredMode.REQUIRED)
    var connectorId: String? = null
)
