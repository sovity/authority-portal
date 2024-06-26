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

import com.fasterxml.jackson.annotation.JsonProperty
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Result of the user deletion check.")
data class UserDeletionCheck(
    @field:Schema(description = "User's ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val userId: String,

    @field:Schema(description = "Indicator if the user can be deleted", requiredMode = Schema.RequiredMode.REQUIRED)
    val canBeDeleted: Boolean,

    @field:Schema(
        description = "Indicator for the user being the last PA in their organization",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    @JsonProperty("isLastParticipantAdmin") // Workaround because codegen messes up boolean naming
    val isLastParticipantAdmin: Boolean,

    @field:Schema(
        description = "Indicator for the user being the creator of their organization",
        requiredMode = Schema.RequiredMode.REQUIRED,
        name = "isOrganizationCreator"
    )
    @JsonProperty("isOrganizationCreator") // Workaround because codegen messes up boolean naming
    val isOrganizationCreator: Boolean,

    @field:Schema(description = "List of possible successors (if needed)", requiredMode = Schema.RequiredMode.REQUIRED)
    var possibleCreatorSuccessors: MutableList<PossibleCreatorSuccessor>,
)
