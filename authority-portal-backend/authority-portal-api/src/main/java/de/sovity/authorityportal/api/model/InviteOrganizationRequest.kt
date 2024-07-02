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

@Schema(description = "Information for inviting a new organization.")
data class InviteOrganizationRequest(
    @field:NotBlank(message = "User email cannot be blank")
    @field:Schema(description = "User: Email address", requiredMode = Schema.RequiredMode.REQUIRED)
    val userEmail: String,

    @field:NotBlank(message = "User first name cannot be blank")
    @field:Schema(description = "User: First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val userFirstName: String,

    @field:NotBlank(message = "User last name cannot be blank")
    @field:Schema(description = "User: Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val userLastName: String,

    @field:NotBlank(message = "Organization name cannot be blank")
    @field:Schema(description = "Organization: Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    val orgName: String,

    @field:Schema(description = "User job title", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val userJobTitle: String?,

    @field:Schema(description = "User phone number", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val userPhoneNumber: String?,
)
