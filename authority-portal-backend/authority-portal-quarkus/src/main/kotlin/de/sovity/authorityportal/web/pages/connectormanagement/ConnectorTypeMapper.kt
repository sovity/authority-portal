package de.sovity.authorityportal.web.pages.connectormanagement

import de.sovity.authorityportal.api.model.ConnectorTypeDto
import de.sovity.authorityportal.db.jooq.enums.ConnectorType

fun ConnectorType.toDto(): ConnectorTypeDto = when (this) {
    ConnectorType.OWN -> ConnectorTypeDto.OWN
    ConnectorType.PROVIDED -> ConnectorTypeDto.PROVIDED
    ConnectorType.CAAS -> ConnectorTypeDto.CAAS
}

fun ConnectorTypeDto.toDb(): ConnectorType = when (this) {
    ConnectorTypeDto.OWN -> ConnectorType.OWN
    ConnectorTypeDto.PROVIDED -> ConnectorType.PROVIDED
    ConnectorTypeDto.CAAS -> ConnectorType.CAAS
}
