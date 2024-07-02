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

@Schema(description = "Uptime information for a single component.")
data class UptimeStatusDto(
    @field:Schema(description = "Status of the component", requiredMode = Schema.RequiredMode.REQUIRED)
    val componentStatus: ComponentStatusDto,
    @field:Schema(description = "Uptime in percent", requiredMode = Schema.RequiredMode.REQUIRED)
    val uptimePercentage: Double,
    @field:Schema(
        description = "Time span used for uptime percentage calculation",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val timeSpanSeconds: Long,
    @field:Schema(description = "Time span since last incident", requiredMode = Schema.RequiredMode.REQUIRED)
    val upSinceSeconds: Long,
)
