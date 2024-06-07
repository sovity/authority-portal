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

package de.sovity.authorityportal.broker.dao.pages.catalog;

import de.sovity.authorityportal.broker.api.model.CatalogPageSortingType;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.jooq.OrderField;

import java.util.List;

@ApplicationScoped
public class CatalogQuerySortingService {
    @NotNull
    public List<OrderField<?>> getOrderBy(CatalogQueryFields fields, @NonNull CatalogPageSortingType sorting) {
        List<OrderField<?>> orderBy;
        if (sorting == CatalogPageSortingType.TITLE) {
            orderBy = List.of(
                    fields.getDataOfferTable().ASSET_TITLE.asc(),
                    fields.getConnectorTable().CONNECTOR_ID.asc()
            );
        } else if (sorting == CatalogPageSortingType.MOST_RECENT) {
            orderBy = List.of(
                    fields.getDataOfferTable().CREATED_AT.desc(),
                    fields.getConnectorTable().CONNECTOR_ID.asc()
            );
        } else if (sorting == CatalogPageSortingType.ORIGINATOR) {
            orderBy = List.of(
                    fields.getConnectorTable().CONNECTOR_ID.asc(),
                    fields.getDataOfferTable().ASSET_TITLE.asc()
            );
        } else if (sorting == CatalogPageSortingType.VIEW_COUNT) {
            orderBy = List.of(
                    fields.getViewCount().desc(),
                    fields.getConnectorTable().CONNECTOR_ID.asc()
            );
        } else {
            throw new IllegalArgumentException("Unknown %s: %s".formatted(CatalogPageSortingType.class.getName(), sorting));
        }
        return orderBy;
    }
}
