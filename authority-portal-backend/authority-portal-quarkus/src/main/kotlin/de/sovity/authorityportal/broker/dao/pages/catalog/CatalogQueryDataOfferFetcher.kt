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
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter
import de.sovity.authorityportal.broker.dao.pages.catalog.models.DataOfferListEntryRs
import de.sovity.authorityportal.broker.dao.pages.catalog.models.PageQuery
import de.sovity.authorityportal.broker.dao.utils.MultisetUtils
import de.sovity.authorityportal.db.jooq.tables.Connector
import de.sovity.authorityportal.db.jooq.tables.DataOffer
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.Field
import org.jooq.Record
import org.jooq.SelectOnConditionStep
import org.jooq.SelectSelectStep
import org.jooq.impl.DSL

@ApplicationScoped
class CatalogQueryDataOfferFetcher(
    val catalogQuerySortingService: CatalogQuerySortingService,
    val catalogQueryFilterService: CatalogQueryFilterService,
    val catalogQueryContractOfferFetcher: CatalogQueryContractOfferFetcher
) {
    /**
     * Query data offers
     *
     * @param fields      query fields
     * @param searchQuery search query
     * @param filters     filters (queries + filter clauses)
     * @param sorting     sorting
     * @param pageQuery   pagination
     * @return [Field] of [DataOfferListEntryRs]s
     */
    fun queryDataOffers(
        environment: String,
        fields: CatalogQueryFields,
        searchQuery: String?,
        filters: List<CatalogQueryFilter>,
        sorting: CatalogPageSortingType,
        pageQuery: PageQuery
    ): Field<List<DataOfferListEntryRs>> {
        val c = fields.connectorTable
        val d = fields.dataOfferTable

        val query = DSL.select(
            d.ASSET_ID.`as`("assetId"),
            d.ASSET_TITLE.`as`("assetTitle"),
            d.DESCRIPTION.`as`("description"),
            d.VERSION.`as`("version"),
            d.KEYWORDS.`as`("keywords"),
            c.CONNECTOR_ID.`as`("connectorId"),
            c.MDS_ID.`as`("organizationId"),
            fields.organizationName.`as`("organizationName"),
            c.ONLINE_STATUS.`as`("connectorOnlineStatus"),
            fields.offlineSinceOrLastUpdatedAt.`as`("connectorOfflineSinceOrLastUpdatedAt"),
            c.ENDPOINT_URL.`as`("connectorEndpointUrl"),
            d.CREATED_AT,
            d.UPDATED_AT
        )
            .fromCatalogQueryTables(c, d)
            .where(catalogQueryFilterService.filterDbQuery(environment, fields, searchQuery, filters))
            .orderBy(catalogQuerySortingService.getOrderBy(fields, sorting))
            .limit(pageQuery.offset, pageQuery.limit)

        return MultisetUtils.multiset(query, DataOfferListEntryRs::class)
    }

    /**
     * Query number of data offers
     *
     * @param fields      query fields
     * @param searchQuery search query
     * @param filters     filters (queries + filter clauses)
     * @return [Field] with number of data offers
     */
    fun queryNumDataOffers(
        environment: String,
        fields: CatalogQueryFields,
        searchQuery: String?,
        filters: List<CatalogQueryFilter>
    ): Field<Int> {
        val query = DSL.select(DSL.count())
            .fromCatalogQueryTables(fields.connectorTable, fields.dataOfferTable)
            .where(catalogQueryFilterService.filterDbQuery(environment, fields, searchQuery, filters))
        return DSL.field(query)
    }

    private fun <T : Record?> SelectSelectStep<T>.fromCatalogQueryTables(
        c: Connector,
        d: DataOffer,
    ): SelectOnConditionStep<T> {
        return this.from(d).leftJoin(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
    }
}
