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
import jakarta.validation.constraints.NotBlank

@Schema(description = "Connector object for connector registration.")
data class CreateConnectorWithJwksRequest(
    @field:NotBlank(message = "Name cannot be blank")
    @field:Schema(description = "Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,

    @field:NotBlank(message = "Location cannot be blank")
    @field:Schema(description = "Location", requiredMode = Schema.RequiredMode.REQUIRED)
    val location: String,

    @field:NotBlank(message = "URL of the connector frontend cannot be blank")
    @field:Schema(description = "URL of the connector frontend", requiredMode = Schema.RequiredMode.REQUIRED)
    var frontendUrl: String,

    @field:NotBlank(message = "URL of the connector endpoint cannot be blank")
    @field:Schema(description = "URL of the connector endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    var endpointUrl: String,

    @field:NotBlank(message = "URL of the connector management endpoint cannot be blank")
    @field:Schema(description = "URL of the connector management endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    var managementUrl: String,

    @field:NotBlank(message = "JWKS URL cannot be blank")
    @field:Schema(description = "JWKS URL of the connector", requiredMode = Schema.RequiredMode.REQUIRED)
    val jwksUrl: String,
)
