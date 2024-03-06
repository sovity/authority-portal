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

package de.sovity.authorityportal.web.thirdparty.broker.model

import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Information for one connector, as required for the Authority Portal.")
class AuthorityPortalConnectorInfo {
    @Schema(description = "Connector Endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    var connectorEndpoint: String = ""
    @Schema(description = "Connector Participant ID", requiredMode = Schema.RequiredMode.REQUIRED)
    var participantId: String = ""
    @Schema(description = "Number of Data Offers in this connector", requiredMode = Schema.RequiredMode.REQUIRED)
    var dataOfferCount: Int = 0
    @Schema(description = "Connector Online Status", requiredMode = Schema.RequiredMode.REQUIRED)
    var onlineStatus: ConnectorOnlineStatus? = null
    @Schema(description = "Last successful refresh time stamp of the online status", requiredMode = Schema.RequiredMode.REQUIRED)
    var offlineSinceOrLastUpdatedAt: OffsetDateTime? = null
}

