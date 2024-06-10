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

import de.sovity.authorityportal.broker.api.model.ConnectorOnlineStatusDto
import de.sovity.authorityportal.broker.api.model.DataOfferDetailContractOffer
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageQuery
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageResult
import de.sovity.authorityportal.broker.dao.pages.dataoffer.DataOfferDetailPageQueryService
import de.sovity.authorityportal.broker.dao.pages.dataoffer.ViewCountLogger
import de.sovity.authorityportal.broker.dao.pages.dataoffer.model.ContractOfferRs
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.util.Objects

@ApplicationScoped
class DataOfferDetailApiService(
    val dataOfferDetailPageQueryService: DataOfferDetailPageQueryService,
    val viewCountLogger: ViewCountLogger,
    val dataOfferMappingUtils: DataOfferMappingUtils,
    val dsl: DSLContext
) {
    fun dataOfferDetailPage(environment: String?, query: DataOfferDetailPageQuery): DataOfferDetailPageResult {
        Objects.requireNonNull(query, "query must not be null")

        val dataOffer =
            dataOfferDetailPageQueryService.queryDataOfferDetailsPage(dsl, query.assetId, query.connectorEndpoint)
        val asset = dataOfferMappingUtils.buildUiAsset(
            dataOffer!!.assetUiJson,
            dataOffer.connectorEndpoint,
            dataOffer.connectorParticipantId,
            dataOffer.organizationName
        )
        viewCountLogger.increaseDataOfferViewCount(dsl, query.assetId, query.connectorEndpoint)

        val result = DataOfferDetailPageResult()
        result.setAssetId(dataOffer.assetId)
        result.setConnectorEndpoint(dataOffer.connectorEndpoint)
        result.setConnectorOnlineStatus(mapConnectorOnlineStatus(dataOffer.connectorOnlineStatus))
        result.setConnectorOfflineSinceOrLastUpdatedAt(dataOffer.connectorOfflineSinceOrLastUpdatedAt)
        result.setAsset(asset)
        result.setCreatedAt(dataOffer.createdAt)
        result.setUpdatedAt(dataOffer.updatedAt)
        result.setContractOffers(buildDataOfferDetailContractOffers(dataOffer.contractOffers))
        result.setViewCount(dataOffer.viewCount)
        return result
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
        return contractOffers.stream().map { offer: ContractOfferRs -> this.buildDataOfferDetailContractOffer(offer) }
            .toList()
    }

    private fun buildDataOfferDetailContractOffer(offer: ContractOfferRs): DataOfferDetailContractOffer {
        val newOffer = DataOfferDetailContractOffer()
        newOffer.setCreatedAt(offer.createdAt)
        newOffer.setUpdatedAt(offer.updatedAt)
        newOffer.setContractOfferId(offer.contractOfferId)
        newOffer.setContractPolicy(dataOfferMappingUtils.buildUiPolicy(offer.policyUiJson))
        return newOffer
    }
}
