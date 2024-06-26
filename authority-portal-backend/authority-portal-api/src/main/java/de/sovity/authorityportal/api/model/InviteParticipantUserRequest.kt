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
import jakarta.validation.constraints.NotNull

@Schema(description = "User information for creating an organization-internal invitation.")
data class InviteParticipantUserRequest(
    @field:NotBlank(message = "Email address cannot be blank")
    @field:Schema(description = "Email address", requiredMode = Schema.RequiredMode.REQUIRED)
    val email: String,

    @field:NotBlank(message = "First name cannot be blank")
    @field:Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,

    @field:NotBlank(message = "Last name cannot be blank")
    @field:Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,

    @NotNull(message = "Role cannot be null")
    @field:Schema(description = "Participant role", requiredMode = Schema.RequiredMode.REQUIRED)
    val role: UserRoleDto,
)
