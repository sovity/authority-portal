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

package de.sovity.authorityportal.broker.services.api;

import de.sovity.authorityportal.broker.api.model.PaginationMetadata;
import de.sovity.authorityportal.broker.dao.pages.catalog.models.PageQuery;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;

@ApplicationScoped
public class PaginationMetadataUtils {

    @NotNull
    public PaginationMetadata buildDummyPaginationMetadata(int numResults) {
        return new PaginationMetadata(numResults, numResults, 1, numResults);
    }

    public PageQuery getPageQuery(Integer pageOneBased, int pageSize) {
        int pageZeroBased = getPageZeroBased(pageOneBased);
        int offset = pageZeroBased * pageSize;
        return new PageQuery(offset, pageSize);
    }

    public PaginationMetadata buildPaginationMetadata(Integer pageOneBased, int pageSize, int numVisible, int numTotalResults) {
        int pageZeroBased = getPageZeroBased(pageOneBased);
        var paginationMetadata = new PaginationMetadata();
        paginationMetadata.setNumTotal(numTotalResults);
        paginationMetadata.setNumVisible(numVisible);
        paginationMetadata.setPageOneBased(pageZeroBased + 1);
        paginationMetadata.setPageSize(pageSize);
        return paginationMetadata;
    }

    private int getPageZeroBased(Integer pageOneBased) {
        return pageOneBased == null ? 0 : (pageOneBased - 1);
    }
}
