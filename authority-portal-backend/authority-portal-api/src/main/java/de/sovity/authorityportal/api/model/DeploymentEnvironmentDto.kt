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

@Schema(description = "Connector deployment environment.")
data class DeploymentEnvironmentDto(
    @field:Schema(description = "Deployment environment ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val environmentId: String,
    @field:Schema(description = "Environment localized name", requiredMode = Schema.RequiredMode.REQUIRED)
    val title: String,
    @field:Schema(description = "DAPS Token URL", requiredMode = Schema.RequiredMode.REQUIRED)
    val dapsTokenUrl: String,
    @field:Schema(description = "DAPS JWKS URL", requiredMode = Schema.RequiredMode.REQUIRED)
    val dapsJwksUrl: String,
    @field:Schema(description = "Logging House URL", requiredMode = Schema.RequiredMode.REQUIRED)
    val loggingHouseUrl: String,
)
