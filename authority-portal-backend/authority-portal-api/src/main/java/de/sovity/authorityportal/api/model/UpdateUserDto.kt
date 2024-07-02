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

@Schema(description = "Information about the user.")
data class UpdateUserDto(
    @field:Schema(description = "User's First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,

    @field:NotBlank(message = "User's Last name cannot be blank")
    @field:Schema(description = "User's Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,

    @field:NotBlank(message = "User's Job title cannot be blank")
    @field:Schema(description = "User's Job title", requiredMode = Schema.RequiredMode.REQUIRED)
    val jobTitle: String,

    @field:NotBlank(message = "User's Phone number cannot be blank")
    @field:Schema(description = "User's Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    val phone: String,

    @field:NotBlank(message = "User's email cannot be blank")
    @field:Schema(description = "User's email", requiredMode = Schema.RequiredMode.REQUIRED)
    val email: String,
)
