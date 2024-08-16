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

@Schema(description = "DTO for configuring SP Connectors")
data class ConfigureProvidedConnectorWithCertificateRequest(
    @field:NotBlank(message = "URL of the connector frontend cannot be blank")
    @field:Schema(description = "URL of the connector frontend", requiredMode = Schema.RequiredMode.REQUIRED)
    var frontendUrl: String,

    @field:NotBlank(message = "URL of the connector endpoint cannot be blank")
    @field:Schema(description = "URL of the connector endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    var endpointUrl: String,

    @field:NotBlank(message = "URL of the connector management endpoint cannot be blank")
    @field:Schema(description = "URL of the connector management endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    var managementUrl: String,

    @field:NotBlank(message = "Public key of certificate cannot be blank")
    @field:Schema(description = "Public key of certificate", requiredMode = Schema.RequiredMode.REQUIRED)
    val certificate: String,
)
