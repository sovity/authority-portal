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

package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Status information for components and connectors.")
data class ComponentStatusOverview(
    @field:Schema(description = "DAPS Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val dapsStatus: UptimeStatusDto?,
    @field:Schema(description = "Logging House Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val loggingHouseStatus: UptimeStatusDto?,
    @field:Schema(description = "Catalog crawler (Broker) Status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val brokerStatus: UptimeStatusDto?,
    @field:Schema(description = "Number of online connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val onlineConnectors: Int,
    @field:Schema(description = "Number of disturbed connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val disturbedConnectors: Int,
    @field:Schema(description = "Number of offline connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val offlineConnectors: Int,
)
