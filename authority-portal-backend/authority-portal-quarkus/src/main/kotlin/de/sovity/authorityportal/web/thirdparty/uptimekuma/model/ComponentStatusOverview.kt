package de.sovity.authorityportal.web.thirdparty.uptimekuma.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Information about the online status of Data Space components.")
class ComponentStatusOverview {
    @Schema(description = "Broker status", requiredMode = Schema.RequiredMode.REQUIRED)
    var broker: ComponentStatus? = null
    @Schema(description = "DAPS status", requiredMode = Schema.RequiredMode.REQUIRED)
    var daps: ComponentStatus? = null
    @Schema(description = "Logging House status", requiredMode = Schema.RequiredMode.REQUIRED)
    var loggingHouse: ComponentStatus? = null
}
