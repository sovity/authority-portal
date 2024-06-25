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

@Schema(description = "Catalog Page and visible filters")
data class CatalogPageResult(
    @field:Schema(description = "Available filter options", requiredMode = Schema.RequiredMode.REQUIRED)
    val availableFilters: CnfFilter,

    @field:Schema(description = "Available sorting options", requiredMode = Schema.RequiredMode.REQUIRED)
    val availableSortings: List<CatalogPageSortingItem>,

    @field:Schema(description = "Pagination Metadata", requiredMode = Schema.RequiredMode.REQUIRED)
    val paginationMetadata: PaginationMetadata,

    @field:Schema(description = "Current page of data offers", requiredMode = Schema.RequiredMode.REQUIRED)
    val dataOffers: List<CatalogDataOffer>,
)
