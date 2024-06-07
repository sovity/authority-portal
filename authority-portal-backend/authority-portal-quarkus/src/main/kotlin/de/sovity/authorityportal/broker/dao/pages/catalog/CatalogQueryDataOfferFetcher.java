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
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter;
import de.sovity.authorityportal.broker.dao.pages.catalog.models.DataOfferListEntryRs;
import de.sovity.authorityportal.broker.dao.pages.catalog.models.PageQuery;
import de.sovity.authorityportal.broker.dao.utils.MultisetUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;
import org.jooq.Field;
import org.jooq.Record;
import org.jooq.SelectOnConditionStep;
import org.jooq.SelectSelectStep;
import org.jooq.impl.DSL;

import java.util.List;

@ApplicationScoped
public class CatalogQueryDataOfferFetcher {
    @Inject
    CatalogQuerySortingService catalogQuerySortingService;
    @Inject
    CatalogQueryFilterService catalogQueryFilterService;
    @Inject
    CatalogQueryContractOfferFetcher catalogQueryContractOfferFetcher;

    /**
     * Query data offers
     *
     * @param fields      query fields
     * @param searchQuery search query
     * @param filters     filters (queries + filter clauses)
     * @param sorting     sorting
     * @param pageQuery   pagination
     * @return {@link Field} of {@link DataOfferListEntryRs}s
     */
    public Field<List<DataOfferListEntryRs>> queryDataOffers(
            String environment,
            CatalogQueryFields fields,
            String searchQuery,
            List<CatalogQueryFilter> filters,
            CatalogPageSortingType sorting,
            PageQuery pageQuery
    ) {
        var c = fields.getConnectorTable();
        var d = fields.getDataOfferTable();

        var select = DSL.select(
                d.ASSET_ID.as("assetId"),
                d.ASSET_JSON_LD.as("assetJsonLd"),
                d.CREATED_AT,
                d.UPDATED_AT,
                catalogQueryContractOfferFetcher.getContractOffers(d).as("contractOffers"),
                c.CONNECTOR_ID.as("connectorId"),
                c.ENDPOINT_URL.as("connectorEndpointUrl"),
                c.ONLINE_STATUS.as("connectorOnlineStatus"),
                c.MDS_ID.as("connectorParticipantId"),
                fields.getOrganizationName().as("organizationName"),
                fields.getOfflineSinceOrLastUpdatedAt().as("connectorOfflineSinceOrLastUpdatedAt")
        );

        var query = from(select, fields)
                .where(catalogQueryFilterService.filterDbQuery(environment, fields, searchQuery, filters))
                .orderBy(catalogQuerySortingService.getOrderBy(fields, sorting))
                .limit(pageQuery.offset(), pageQuery.limit());

        return MultisetUtils.multiset(query, DataOfferListEntryRs.class);
    }

    /**
     * Query number of data offers
     *
     * @param fields      query fields
     * @param searchQuery search query
     * @param filters     filters (queries + filter clauses)
     * @return {@link Field} with number of data offers
     */
    public Field<Integer> queryNumDataOffers(String environment, CatalogQueryFields fields, String searchQuery, List<CatalogQueryFilter> filters) {
        var query = from(DSL.select(DSL.count()), fields)
                .where(catalogQueryFilterService.filterDbQuery(environment, fields, searchQuery, filters));
        return DSL.field(query);
    }

    private <T extends Record> SelectOnConditionStep<T> from(SelectSelectStep<T> select, CatalogQueryFields fields) {
        var c = fields.getConnectorTable();
        var d = fields.getDataOfferTable();
        return select.from(d).leftJoin(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID));
    }
}
