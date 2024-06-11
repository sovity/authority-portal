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
package de.sovity.authorityportal.broker.dao.pages.dataoffer

import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryContractOfferFetcher
import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryFields
import de.sovity.authorityportal.broker.dao.pages.dataoffer.model.DataOfferDetailRs
import de.sovity.authorityportal.broker.services.config.BrokerServerDataspaceSettings
import de.sovity.authorityportal.db.jooq.Tables
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext

@ApplicationScoped
class DataOfferDetailPageQueryService(
    val catalogQueryContractOfferFetcher: CatalogQueryContractOfferFetcher,
    val brokerServerDataspaceSettings: BrokerServerDataspaceSettings,
    val dsl: DSLContext
) {
    fun queryDataOfferDetailsPage(assetId: String, endpoint: String): DataOfferDetailRs? {
        // We are re-using the catalog page query stuff as long as we can get away with it
        val fields = CatalogQueryFields(
            Tables.CONNECTOR,
            Tables.DATA_OFFER,
            Tables.DATA_OFFER_VIEW_COUNT,
            brokerServerDataspaceSettings.dataSpaceConfig
        )

        val d = fields.dataOfferTable
        val c = fields.connectorTable

        return dsl.select(
            d.ASSET_ID,
            d.CREATED_AT,
            d.UPDATED_AT,
            catalogQueryContractOfferFetcher.getContractOffers(fields.dataOfferTable).`as`("contractOffers"),
            fields.offlineSinceOrLastUpdatedAt.`as`("connectorOfflineSinceOrLastUpdatedAt"),
            c.CONNECTOR_ID.`as`("connectorId"),
            c.ONLINE_STATUS.`as`("connectorOnlineStatus"),
            c.MDS_ID.`as`("connectorParticipantId"),
            fields.organizationName.`as`("organizationName"),
            fields.viewCount.`as`("viewCount")
        )
            .from(d)
            .leftJoin(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
            .where(d.ASSET_ID.eq(assetId).and(d.CONNECTOR_ID.eq(endpoint)))
            .fetchOneInto(DataOfferDetailRs::class.java)
    }
}