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
package de.sovity.authorityportal.broker.services.api

import de.sovity.authorityportal.broker.api.model.PaginationMetadata
import de.sovity.authorityportal.broker.dao.pages.catalog.models.PageQuery
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class PaginationMetadataUtils {
    fun buildDummyPaginationMetadata(numResults: Int): PaginationMetadata {
        return PaginationMetadata(
            numTotal = numResults,
            numVisible = numResults,
            pageOneBased = 1,
            pageSize = numResults
        )
    }

    fun getPageQuery(pageOneBased: Int?, pageSize: Int): PageQuery {
        val pageZeroBased = getPageZeroBased(pageOneBased)
        val offset = pageZeroBased * pageSize
        return PageQuery(offset, pageSize)
    }

    fun buildPaginationMetadata(
        pageOneBased: Int?,
        pageSize: Int,
        numVisible: Int,
        numTotalResults: Int
    ): PaginationMetadata {
        val pageZeroBased = getPageZeroBased(pageOneBased)

        return PaginationMetadata(
            numTotal = numTotalResults,
            numVisible = numVisible,
            pageOneBased = pageZeroBased + 1,
            pageSize = pageSize
        )
    }

    private fun getPageZeroBased(pageOneBased: Int?): Int {
        return if (pageOneBased == null) 0 else (pageOneBased - 1)
    }
}
