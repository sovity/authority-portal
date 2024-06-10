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

import de.sovity.authorityportal.broker.api.model.CatalogPageSortingType
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter
import de.sovity.authorityportal.broker.dao.pages.catalog.models.DataOfferListEntryRs
import de.sovity.authorityportal.broker.dao.pages.catalog.models.PageQuery
import de.sovity.authorityportal.broker.dao.utils.MultisetUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
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
        searchQuery: String,
        filters: List<CatalogQueryFilter>,
        sorting: CatalogPageSortingType,
        pageQuery: PageQuery
    ): Field<List<DataOfferListEntryRs>> {
        val c = fields.connectorTable
        val d = fields.dataOfferTable

        val select = DSL.select(
            d.ASSET_ID.`as`("assetId"),
            d.UI_ASSET_JSON.`as`("assetUiJson"),
            d.CREATED_AT,
            d.UPDATED_AT,
            catalogQueryContractOfferFetcher.getContractOffers(d).`as`("contractOffers"),
            c.CONNECTOR_ID.`as`("connectorId"),
            c.ENDPOINT_URL.`as`("connectorEndpointUrl"),
            c.ONLINE_STATUS.`as`("connectorOnlineStatus"),
            c.MDS_ID.`as`("connectorParticipantId"),
            fields.organizationName.`as`("organizationName"),
            fields.offlineSinceOrLastUpdatedAt.`as`("connectorOfflineSinceOrLastUpdatedAt")
        )

        val query = from(select, fields)
            .where(catalogQueryFilterService.filterDbQuery(environment, fields, searchQuery, filters))
            .orderBy(catalogQuerySortingService.getOrderBy(fields, sorting))
            .limit(pageQuery.offset, pageQuery.limit)

        return MultisetUtils.multiset(query, DataOfferListEntryRs::class.java)
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
        environment: String?,
        fields: CatalogQueryFields,
        searchQuery: String?,
        filters: List<CatalogQueryFilter?>?
    ): Field<Int> {
        val query = from(DSL.select(DSL.count()), fields)
            .where(catalogQueryFilterService.filterDbQuery(environment, fields, searchQuery, filters))
        return DSL.field(query)
    }

    private fun <T : Record?> from(select: SelectSelectStep<T>, fields: CatalogQueryFields): SelectOnConditionStep<T> {
        val c = fields.connectorTable
        val d = fields.dataOfferTable
        return select.from(d).leftJoin(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
    }
}
