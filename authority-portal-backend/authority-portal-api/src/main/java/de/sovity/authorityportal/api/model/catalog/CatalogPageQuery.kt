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

@Schema(description = "Filterable Catalog Page Query")
data class CatalogPageQuery(
    @field:Schema(description = "Selected filters", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val filter: CnfFilterValue?,

    @field:Schema(description = "Search query", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val searchQuery: String?,

    @field:Schema(description = "Sorting", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val sorting: CatalogPageSortingType?,

    @field:Schema(
        description = "Page number, one based, meaning the first page is page 1.",
        example = "1",
        defaultValue = "1",
        type = "n",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val pageOneBased: Int = 1,
)

