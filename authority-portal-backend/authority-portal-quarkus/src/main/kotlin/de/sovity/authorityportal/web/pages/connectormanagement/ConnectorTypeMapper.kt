/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

package de.sovity.authorityportal.web.pages.connectormanagement

import de.sovity.authorityportal.api.model.ConnectorTypeDto
import de.sovity.authorityportal.db.jooq.enums.ConnectorType

fun ConnectorType.toDto(): ConnectorTypeDto = when (this) {
    ConnectorType.OWN -> ConnectorTypeDto.OWN
    ConnectorType.PROVIDED -> ConnectorTypeDto.PROVIDED
    ConnectorType.CAAS -> ConnectorTypeDto.CAAS
    ConnectorType.AWAITING_PROVISIONING -> ConnectorTypeDto.AWAITING_PROVISIONING
}

fun ConnectorTypeDto.toDb(): ConnectorType = when (this) {
    ConnectorTypeDto.OWN -> ConnectorType.OWN
    ConnectorTypeDto.PROVIDED -> ConnectorType.PROVIDED
    ConnectorTypeDto.CAAS -> ConnectorType.CAAS
    ConnectorTypeDto.AWAITING_PROVISIONING -> ConnectorType.AWAITING_PROVISIONING
}
