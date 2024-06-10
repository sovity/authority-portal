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

package de.sovity.authorityportal.broker.services.api;

import de.sovity.authorityportal.broker.api.model.ConnectorOnlineStatusDto;
import de.sovity.authorityportal.broker.api.model.DataOfferDetailContractOffer;
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageQuery;
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageResult;
import de.sovity.authorityportal.broker.dao.pages.dataoffer.DataOfferDetailPageQueryService;
import de.sovity.authorityportal.broker.dao.pages.dataoffer.ViewCountLogger;
import de.sovity.authorityportal.broker.dao.pages.dataoffer.model.ContractOfferRs;
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jetbrains.annotations.NotNull;
import org.jooq.DSLContext;

import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class DataOfferDetailApiService {
    @Inject
    DataOfferDetailPageQueryService dataOfferDetailPageQueryService;
    @Inject
    ViewCountLogger viewCountLogger;
    @Inject
    DataOfferMappingUtils dataOfferMappingUtils;
    @Inject
    DSLContext dsl;

    public DataOfferDetailPageResult dataOfferDetailPage(String environment, DataOfferDetailPageQuery query) {
        Objects.requireNonNull(query, "query must not be null");

        var dataOffer = dataOfferDetailPageQueryService.queryDataOfferDetailsPage(dsl, query.getAssetId(), query.getConnectorEndpoint());
        var asset = dataOfferMappingUtils.buildUiAsset(
            dataOffer.getAssetUiJson(),
            dataOffer.getConnectorEndpoint(),
            dataOffer.getConnectorParticipantId(),
            dataOffer.getOrganizationName()
        );
        viewCountLogger.increaseDataOfferViewCount(dsl, query.getAssetId(), query.getConnectorEndpoint());

        var result = new DataOfferDetailPageResult();
        result.setAssetId(dataOffer.getAssetId());
        result.setConnectorEndpoint(dataOffer.getConnectorEndpoint());
        result.setConnectorOnlineStatus(mapConnectorOnlineStatus(dataOffer.getConnectorOnlineStatus()));
        result.setConnectorOfflineSinceOrLastUpdatedAt(dataOffer.getConnectorOfflineSinceOrLastUpdatedAt());
        result.setAsset(asset);
        result.setCreatedAt(dataOffer.getCreatedAt());
        result.setUpdatedAt(dataOffer.getUpdatedAt());
        result.setContractOffers(buildDataOfferDetailContractOffers(dataOffer.getContractOffers()));
        result.setViewCount(dataOffer.getViewCount());
        return result;
    }

    private ConnectorOnlineStatusDto mapConnectorOnlineStatus(ConnectorOnlineStatus connectorOnlineStatus) {
        if (connectorOnlineStatus == null) {
            return ConnectorOnlineStatusDto.OFFLINE;
        }

        return switch (connectorOnlineStatus) {
            case ONLINE -> ConnectorOnlineStatusDto.ONLINE;
            case OFFLINE -> ConnectorOnlineStatusDto.OFFLINE;
            case DEAD -> ConnectorOnlineStatusDto.DEAD;
        };
    }

    private List<DataOfferDetailContractOffer> buildDataOfferDetailContractOffers(List<ContractOfferRs> contractOffers) {
        return contractOffers.stream().map(this::buildDataOfferDetailContractOffer).toList();
    }

    @NotNull
    private DataOfferDetailContractOffer buildDataOfferDetailContractOffer(ContractOfferRs offer) {
        var newOffer = new DataOfferDetailContractOffer();
        newOffer.setCreatedAt(offer.getCreatedAt());
        newOffer.setUpdatedAt(offer.getUpdatedAt());
        newOffer.setContractOfferId(offer.getContractOfferId());
        newOffer.setContractPolicy(dataOfferMappingUtils.buildUiPolicy(offer.getPolicyUiJson()));
        return newOffer;
    }
}
