package de.sovity.authorityportal.web.thirdparty.broker.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Connector's online status")
enum class ConnectorOnlineStatus {
    ONLINE,
    OFFLINE,
    DEAD
}
