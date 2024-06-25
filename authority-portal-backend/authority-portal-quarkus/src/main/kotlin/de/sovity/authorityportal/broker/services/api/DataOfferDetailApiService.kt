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
package de.sovity.authorityportal.broker.services.api

import de.sovity.authorityportal.api.model.catalog.ConnectorOnlineStatusDto
import de.sovity.authorityportal.api.model.catalog.DataOfferDetailContractOffer
import de.sovity.authorityportal.api.model.catalog.DataOfferDetailPageQuery
import de.sovity.authorityportal.api.model.catalog.DataOfferDetailPageResult
import de.sovity.authorityportal.broker.dao.pages.dataoffer.DataOfferDetailPageQueryService
import de.sovity.authorityportal.broker.dao.pages.dataoffer.ViewCountLogger
import de.sovity.authorityportal.broker.dao.pages.dataoffer.model.ContractOfferRs
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.web.utils.notFound
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext

@ApplicationScoped
class DataOfferDetailApiService(
    val dataOfferDetailPageQueryService: DataOfferDetailPageQueryService,
    val viewCountLogger: ViewCountLogger,
    val dataOfferMapper: DataOfferMapper,
    val dsl: DSLContext
) {
    fun dataOfferDetailPage(environment: String, query: DataOfferDetailPageQuery): DataOfferDetailPageResult {
        val dataOffer = dataOfferDetailPageQueryService
            .queryDataOfferDetailsPage(environment, query.assetId, query.connectorId)
            ?: notFound("Data offer not found.")

        val asset = dataOfferMapper.readUiAsset(dataOffer.assetUiJson)
        viewCountLogger.increaseDataOfferViewCount(query.assetId, query.connectorId)

        return DataOfferDetailPageResult(
            assetId = dataOffer.assetId,
            connectorEndpoint = dataOffer.connectorEndpoint,
            connectorOnlineStatus = mapConnectorOnlineStatus(dataOffer.connectorOnlineStatus),
            connectorOfflineSinceOrLastUpdatedAt = dataOffer.connectorOfflineSinceOrLastUpdatedAt,
            asset = asset,
            createdAt = dataOffer.createdAt,
            updatedAt = dataOffer.updatedAt,
            contractOffers = buildDataOfferDetailContractOffers(dataOffer.contractOffers),
            viewCount = dataOffer.viewCount
        )

    }

    private fun mapConnectorOnlineStatus(connectorOnlineStatus: ConnectorOnlineStatus?): ConnectorOnlineStatusDto {
        if (connectorOnlineStatus == null) {
            return ConnectorOnlineStatusDto.OFFLINE
        }

        return when (connectorOnlineStatus) {
            ConnectorOnlineStatus.ONLINE -> ConnectorOnlineStatusDto.ONLINE
            ConnectorOnlineStatus.OFFLINE -> ConnectorOnlineStatusDto.OFFLINE
            ConnectorOnlineStatus.DEAD -> ConnectorOnlineStatusDto.DEAD
        }
    }

    private fun buildDataOfferDetailContractOffers(contractOffers: List<ContractOfferRs>): List<DataOfferDetailContractOffer> {
        return contractOffers.map { buildDataOfferDetailContractOffer(it) }
    }

    private fun buildDataOfferDetailContractOffer(offer: ContractOfferRs): DataOfferDetailContractOffer {
        return DataOfferDetailContractOffer(
            createdAt = offer.createdAt,
            updatedAt = offer.updatedAt,
            contractOfferId = offer.contractOfferId,
            contractPolicy = dataOfferMapper.readUiPolicy(offer.policyUiJson)
        )

    }
}
