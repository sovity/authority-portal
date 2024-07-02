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

@Schema(description = "Information for registering a new central dataspace component.")
data class CentralComponentCreateRequest(
    @field:Schema(description = "Component Name", requiredMode = Schema.RequiredMode.REQUIRED)
    @field:NotBlank(message = "Name of component cannot be blank")
    val name: String,

    @field:Schema(description = "Home Page URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val homepageUrl: String?,

    @field:Schema(description = "Endpoint URL", requiredMode = Schema.RequiredMode.REQUIRED)
    @field:NotBlank(message = "Endpoint URL cannot be blank")
    val endpointUrl:  String,

    @field:Schema(description = "The component's certificate", requiredMode = Schema.RequiredMode.REQUIRED)
    @field:NotBlank(message = "Certificate cannot be blank")
    val certificate: String
)
