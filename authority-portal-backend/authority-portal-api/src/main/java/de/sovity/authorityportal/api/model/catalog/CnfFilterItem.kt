/*
 *  Copyright (c) 2023 sovity GmbH
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  SPDX-License-Identifier: Apache-2.0
 *
 *  Contributors:
 *       sovity GmbH - initial API and implementation
 *
 */
package de.sovity.authorityportal.api.model.catalog

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Attribute Value")
data class CnfFilterItem(
    @field:Schema(
        description = "Value ID",
        example = "MDSLXXXXX1",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val id: String,

    @field:Schema(description = "Value Title", example = "Example Organization", requiredMode = Schema.RequiredMode.REQUIRED)
    val title: String,
)
