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

@Schema(description = "Pagination Metadata")
data class PaginationMetadata(
    @field:Schema(
        description = "Total number of results",
        example = "368",
        type = "n",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val numTotal: Int,

    @field:Schema(
        description = "Visible number of results",
        example = "20",
        type = "n",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val numVisible: Int,

    @field:Schema(
        description = "Page number, one based, meaning the first page is page 1.",
        example = "1",
        defaultValue = "1",
        type = "n",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val pageOneBased: Int,

    @field:Schema(description = "Items per page", example = "20", type = "n", requiredMode = Schema.RequiredMode.REQUIRED)
    val pageSize: Int,
)
