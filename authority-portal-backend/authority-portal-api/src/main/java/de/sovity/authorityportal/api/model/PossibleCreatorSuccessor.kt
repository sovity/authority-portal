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

@Schema(description = "Possible successor (Participant Admin), if a users gets deleted, that is creator of an organization.")
data class PossibleCreatorSuccessor(
    @field:Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val userId: String,
    @field:Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,
    @field:Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,
)
