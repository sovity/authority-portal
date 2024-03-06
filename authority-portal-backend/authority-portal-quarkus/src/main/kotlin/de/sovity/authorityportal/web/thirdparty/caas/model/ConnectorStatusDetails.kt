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
package de.sovity.authorityportal.web.thirdparty.caas.model

import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Wrapper for retrieving the status of a connector")
class ConnectorStatusDetails {
    @Schema(description = "URL pointing to the connector API endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    var endpointUrl: String = ""

    @Schema(description = "URL pointing to the connector frontend", requiredMode = Schema.RequiredMode.REQUIRED)
    var frontendUrl: String = ""

    @Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    var status: CaasStatusDto = CaasStatusDto.ERROR

    @Schema(description = "Date and time of the connector's start", requiredMode = Schema.RequiredMode.REQUIRED)
    var startedAt: OffsetDateTime = OffsetDateTime.MIN

    @Schema(description = "Date and time of the connector's shutdown", requiredMode = Schema.RequiredMode.REQUIRED)
    var endedAt: OffsetDateTime = OffsetDateTime.MIN
}
