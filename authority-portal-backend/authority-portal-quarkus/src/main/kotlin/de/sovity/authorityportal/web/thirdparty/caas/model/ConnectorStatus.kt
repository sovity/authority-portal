package de.sovity.authorityportal.web.thirdparty.caas.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Status of a connector")
enum class ConnectorStatus {
    INIT,
    PROVISIONING,
    AWAITING_RUNNING,
    RUNNING,
    DEPROVISIONING,
    AWAITING_STOPPED,
    STOPPED,
    ERROR,
    NOT_FOUND
}
