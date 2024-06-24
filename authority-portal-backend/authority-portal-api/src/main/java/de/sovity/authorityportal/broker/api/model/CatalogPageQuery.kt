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
package de.sovity.authorityportal.broker.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Filterable Catalog Page Query")
data class CatalogPageQuery(
    @field:Schema(description = "Selected filters")
    val filter: CnfFilterValue?,

    @field:Schema(description = "Search query")
    val searchQuery: String?,

    @field:Schema(description = "Sorting")
    val sorting: CatalogPageSortingType?,

    @field:Schema(
        description = "Page number, one based, meaning the first page is page 1.",
        example = "1",
        defaultValue = "1",
        type = "n"
    )
    val pageOneBased: Int = 1,
)

