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
package de.sovity.authorityportal.broker.dao.pages.catalog

import de.sovity.authorityportal.api.model.catalog.CatalogPageSortingType
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.OrderField

@ApplicationScoped
class CatalogQuerySortingService {
    fun getOrderBy(fields: CatalogQueryFields, sorting: CatalogPageSortingType): List<OrderField<*>> {
        val orderBy = when (sorting) {
            CatalogPageSortingType.TITLE -> listOf<OrderField<*>>(
                fields.dataOfferTable.ASSET_TITLE.asc(),
                fields.connectorTable.CONNECTOR_ID.asc()
            )
            CatalogPageSortingType.MOST_RECENT -> listOf<OrderField<*>>(
                fields.dataOfferTable.CREATED_AT.desc(),
                fields.connectorTable.CONNECTOR_ID.asc()
            )
            CatalogPageSortingType.ORIGINATOR -> listOf<OrderField<*>>(
                fields.connectorTable.CONNECTOR_ID.asc(),
                fields.dataOfferTable.ASSET_TITLE.asc()
            )
            CatalogPageSortingType.VIEW_COUNT -> listOf<OrderField<*>>(
                fields.viewCount.desc(),
                fields.connectorTable.CONNECTOR_ID.asc()
            )
        }
        return orderBy
    }
}
