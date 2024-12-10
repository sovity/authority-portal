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

@Schema(description = "Visible connector in connector overview page(s).")
data class ConnectorOverviewEntryDto(
    @field:Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val id: String,
    @field:Schema(description = "Organization Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val customerOrgName: String,
    @field:Schema(description = "Host Name", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val hostName: String?,
    @field:Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    val type: ConnectorTypeDto,
    @field:Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    val environment: DeploymentEnvironmentDto,
    @field:Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,
    @field:Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    val status: ConnectorStatusDto,
    @field:Schema(description = "Frontend link", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val frontendUrl: String?,
)
