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
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogPageRs;
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter;
import de.sovity.authorityportal.broker.dao.pages.catalog.models.PageQuery;
import de.sovity.authorityportal.db.jooq.Tables;
import de.sovity.authorityportal.broker.services.config.BrokerServerDataspaceSettings;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;

import java.util.List;

@ApplicationScoped
public class CatalogQueryService {
    @Inject
    CatalogQueryDataOfferFetcher catalogQueryDataOfferFetcher;
    @Inject
    CatalogQueryAvailableFilterFetcher catalogQueryAvailableFilterFetcher;
    @Inject
    BrokerServerDataspaceSettings brokerServerDataspaceSettings;

    /**
     * Query all data required for the catalog page
     *
     * @param dsl         transaction
     * @param searchQuery search query
     * @param filters     filters (queries + filter clauses)
     * @param sorting     sorting
     * @param pageQuery   pagination
     * @return {@link CatalogPageRs}
     */
    public CatalogPageRs queryCatalogPage(
            DSLContext dsl,
            String environment,
            String searchQuery,
            List<CatalogQueryFilter> filters,
            CatalogPageSortingType sorting,
            PageQuery pageQuery
    ) {
        var fields = new CatalogQueryFields(
                Tables.CONNECTOR,
                Tables.DATA_OFFER,
                Tables.DATA_OFFER_VIEW_COUNT,
                brokerServerDataspaceSettings.getDataSpaceConfig()
        );

        var availableFilterValues = catalogQueryAvailableFilterFetcher
                .queryAvailableFilterValues(environment, fields, searchQuery, filters);

        var dataOffers = catalogQueryDataOfferFetcher.queryDataOffers(environment, fields, searchQuery, filters, sorting, pageQuery);

        var numTotalDataOffers = catalogQueryDataOfferFetcher.queryNumDataOffers(environment, fields, searchQuery, filters);

        return dsl.select(
                dataOffers.as("dataOffers"),
                availableFilterValues.as("availableFilterValues"),
                numTotalDataOffers.as("numTotalDataOffers")
        ).fetchOneInto(CatalogPageRs.class);
    }

}
