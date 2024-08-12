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

package de.sovity.authorityportal.web.thirdparty.uptimekuma.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Information about the online status of Data Space components.")
class ComponentStatusOverview {
    @Schema(description = "DAPS status", requiredMode = Schema.RequiredMode.REQUIRED)
    var daps: ComponentStatus? = null
    @Schema(description = "Catalog crawler (Broker) status", requiredMode = Schema.RequiredMode.REQUIRED)
    var catalogCrawler: ComponentStatus? = null
    @Schema(description = "Logging House status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    var loggingHouse: ComponentStatus? = null
}
