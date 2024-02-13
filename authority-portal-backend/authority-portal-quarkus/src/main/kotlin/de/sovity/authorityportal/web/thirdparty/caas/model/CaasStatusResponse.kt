package de.sovity.authorityportal.web.thirdparty.caas.model

import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Response of the status of a CaaS")
class CaasStatusResponse {
    @Schema(description = "The ID of the connector")
    var connectorId: String = ""
    @Schema(description = "Connector's Endpoint URL")
    var connectorEndpointUrl: String? = null
    @Schema(description = "Connector's Frontend URL")
    var frontendUrl: String? = null
    @Schema(description = "Connector's Management API URL")
    var managementApiUrl: String? = null
    @Schema(description = "Connector's JWKS URL")
    var connectorJwksUrl: String? = null
    @Schema(description = "Connector's status")
    var status: ConnectorStatus = ConnectorStatus.NOT_FOUND
    @Schema(description = "The end-of-life date and time of the connector")
    var endDateTime: OffsetDateTime? = null
}
