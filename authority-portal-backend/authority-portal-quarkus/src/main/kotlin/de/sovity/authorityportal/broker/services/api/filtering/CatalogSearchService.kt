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
package de.sovity.authorityportal.broker.services.api.filtering

import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryFields
import de.sovity.authorityportal.broker.dao.utils.SearchUtils.simpleSearch
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.Condition

@ApplicationScoped
class CatalogSearchService {
    fun filterBySearch(fields: CatalogQueryFields, searchQuery: String?): Condition {
        return simpleSearch(
            searchQuery, listOf(
                fields.dataOfferTable.ASSET_ID,
                fields.dataOfferTable.ASSET_TITLE,
                fields.dataOfferTable.DATA_CATEGORY,
                fields.dataOfferTable.DATA_SUBCATEGORY,
                fields.dataOfferTable.DESCRIPTION_NO_MARKDOWN,
                fields.dataOfferTable.KEYWORDS_COMMA_JOINED,
                fields.connectorTable.ENDPOINT_URL,
                fields.connectorTable.MDS_ID,
                fields.organizationTable.NAME
            )
        )
    }
}
