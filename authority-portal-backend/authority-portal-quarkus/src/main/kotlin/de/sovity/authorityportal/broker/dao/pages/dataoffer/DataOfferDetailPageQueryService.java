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

package de.sovity.authorityportal.broker.dao.pages.dataoffer;

import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryContractOfferFetcher;
import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryFields;
import de.sovity.authorityportal.broker.dao.pages.dataoffer.model.DataOfferDetailRs;
import de.sovity.authorityportal.db.jooq.Tables;
import de.sovity.authorityportal.broker.services.config.BrokerServerDataspaceSettings;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;

@RequiredArgsConstructor
public class DataOfferDetailPageQueryService {
    private final CatalogQueryContractOfferFetcher catalogQueryContractOfferFetcher;
    private final BrokerServerDataspaceSettings brokerServerDataspaceSettings;

    public DataOfferDetailRs queryDataOfferDetailsPage(DSLContext dsl, String assetId, String endpoint) {
        // We are re-using the catalog page query stuff as long as we can get away with it
        var fields = new CatalogQueryFields(
                Tables.CONNECTOR,
                Tables.DATA_OFFER,
                Tables.DATA_OFFER_VIEW_COUNT,
                brokerServerDataspaceSettings.getDataSpaceConfig()
        );

        var d = fields.getDataOfferTable();
        var c = fields.getConnectorTable();

        return dsl.select(
                        d.ASSET_ID,
                        d.CREATED_AT,
                        d.UPDATED_AT,
                        catalogQueryContractOfferFetcher.getContractOffers(fields.getDataOfferTable()).as("contractOffers"),
                        fields.getOfflineSinceOrLastUpdatedAt().as("connectorOfflineSinceOrLastUpdatedAt"),
                        c.CONNECTOR_ID.as("connectorId"),
                        c.ONLINE_STATUS.as("connectorOnlineStatus"),
                        c.MDS_ID.as("connectorParticipantId"),
                        fields.getOrganizationName().as("organizationName"),
                        fields.getViewCount().as("viewCount"))
                .from(d)
                .leftJoin(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
                .where(d.ASSET_ID.eq(assetId).and(d.CONNECTOR_ID.eq(endpoint)))
                .fetchOneInto(DataOfferDetailRs.class);
    }
}
