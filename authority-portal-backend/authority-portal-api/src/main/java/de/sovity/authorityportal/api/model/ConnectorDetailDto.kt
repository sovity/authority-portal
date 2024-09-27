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

@Schema(description = "Detail information about a deployed connector.")
data class ConnectorDetailDto(
    @field:Schema(description = "Connector ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorId: String,
    @field:Schema(description = "Type", requiredMode = Schema.RequiredMode.REQUIRED)
    val type: ConnectorTypeDto,
    @field:Schema(description = "Owning organization (name)", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationName: String,
    @field:Schema(description = "Owning organization (ID)", requiredMode = Schema.RequiredMode.REQUIRED)
    val organizationId: String,
    @field:Schema(description = "Hosting organization (name)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val hostOrganizationName: String?,
    @field:Schema(description = "Hosting organization (ID)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val hostOrganizationId: String?,
    @field:Schema(description = "Deployment Environment", requiredMode = Schema.RequiredMode.REQUIRED)
    val environment: DeploymentEnvironmentDto,
    @field:Schema(description = "Connector Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorName: String,
    @field:Schema(description = "Location", requiredMode = Schema.RequiredMode.REQUIRED)
    val location: String,
    @field:Schema(description = "Frontend URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val frontendUrl: String?,
    @field:Schema(description = "Endpoint URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val endpointUrl: String?,
    @field:Schema(description = "Management URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val managementUrl: String?,
    @field:Schema(description = "Connector status", requiredMode = Schema.RequiredMode.REQUIRED)
    val status: ConnectorStatusDto,
)
