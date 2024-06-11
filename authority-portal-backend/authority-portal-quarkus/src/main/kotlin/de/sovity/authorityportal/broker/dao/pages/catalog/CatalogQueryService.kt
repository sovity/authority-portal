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
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogPageRs
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter
import de.sovity.authorityportal.broker.dao.pages.catalog.models.PageQuery
import de.sovity.authorityportal.broker.services.config.BrokerServerDataspaceSettings
import de.sovity.authorityportal.db.jooq.Tables
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext

@ApplicationScoped
class CatalogQueryService(
    val catalogQueryDataOfferFetcher: CatalogQueryDataOfferFetcher,
    val catalogQueryAvailableFilterFetcher: CatalogQueryAvailableFilterFetcher,
    val brokerServerDataspaceSettings: BrokerServerDataspaceSettings,
    val dsl: DSLContext
) {
    /**
     * Query all data required for the catalog page
     *
     * @param dsl         transaction
     * @param searchQuery search query
     * @param filters     filters (queries + filter clauses)
     * @param sorting     sorting
     * @param pageQuery   pagination
     * @return [CatalogPageRs]
     */
    fun queryCatalogPage(
        environment: String,
        searchQuery: String?,
        filters: List<CatalogQueryFilter>,
        sorting: CatalogPageSortingType,
        pageQuery: PageQuery
    ): CatalogPageRs {
        val fields = CatalogQueryFields(
            Tables.CONNECTOR,
            Tables.DATA_OFFER,
            Tables.DATA_OFFER_VIEW_COUNT,
            brokerServerDataspaceSettings.dataSpaceConfig
        )

        val availableFilterValues = catalogQueryAvailableFilterFetcher
            .queryAvailableFilterValues(environment, fields, searchQuery, filters)

        val dataOffers = catalogQueryDataOfferFetcher.queryDataOffers(
            environment, fields, searchQuery, filters, sorting, pageQuery
        )

        val numTotalDataOffers =
            catalogQueryDataOfferFetcher.queryNumDataOffers(environment, fields, searchQuery, filters)

        return dsl.select(
            dataOffers.`as`("dataOffers"),
            availableFilterValues.`as`("availableFilterValues"),
            numTotalDataOffers.`as`("numTotalDataOffers")
        ).fetchOneInto(CatalogPageRs::class.java)!!
    }
}