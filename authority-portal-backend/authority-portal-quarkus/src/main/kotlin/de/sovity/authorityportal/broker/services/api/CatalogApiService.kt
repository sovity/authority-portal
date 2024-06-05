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

import de.sovity.authorityportal.broker.api.model.CatalogContractOffer
import de.sovity.authorityportal.broker.api.model.CatalogDataOffer
import de.sovity.authorityportal.broker.api.model.CatalogPageQuery
import de.sovity.authorityportal.broker.api.model.CatalogPageResult
import de.sovity.authorityportal.broker.api.model.CatalogPageSortingItem
import de.sovity.authorityportal.broker.api.model.CatalogPageSortingType
import de.sovity.authorityportal.broker.api.model.ConnectorOnlineStatusDto
import de.sovity.authorityportal.broker.api.model.PaginationMetadata
import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryService
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogPageRs
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter
import de.sovity.authorityportal.broker.dao.pages.catalog.models.DataOfferListEntryRs
import de.sovity.authorityportal.broker.dao.pages.catalog.models.PageQuery
import de.sovity.authorityportal.broker.dao.pages.dataoffer.model.ContractOfferRs
import de.sovity.authorityportal.broker.services.api.filtering.CatalogFilterService
import de.sovity.authorityportal.broker.services.config.BrokerServerSettings
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext
import java.util.Objects
import java.util.function.Function
import java.util.stream.Stream

@ApplicationScoped
class CatalogApiService(
    private val dsl: DSLContext,
    private val paginationMetadataUtils: PaginationMetadataUtils,
    private val catalogQueryService: CatalogQueryService,
    private val dataOfferMappingUtils: DataOfferMappingUtils,
    private val catalogFilterService: CatalogFilterService,
    private val brokerServerSettings: BrokerServerSettings
) {

    fun catalogPage(query: CatalogPageQuery): CatalogPageResult {
        Objects.requireNonNull(query, "query must not be null")


        val filters: List<CatalogQueryFilter> = catalogFilterService.getCatalogQueryFilters(query.filter)

        val pageQuery: PageQuery = paginationMetadataUtils.getPageQuery(
            query.pageOneBased,
            brokerServerSettings.catalogPagePageSize
        )

        val availableSortings = buildAvailableSortings()
        var sorting = query.sorting
        if (sorting == null) {
            sorting = availableSortings[0].sorting
        }

        // execute db query
        val catalogPageRs: CatalogPageRs = catalogQueryService.queryCatalogPage(
            dsl,
            query.searchQuery,
            filters,
            sorting,
            pageQuery
        )

        val paginationMetadata: PaginationMetadata = paginationMetadataUtils.buildPaginationMetadata(
            query.pageOneBased,
            brokerServerSettings.catalogPagePageSize,
            catalogPageRs.getDataOffers().size(),
            catalogPageRs.getNumTotalDataOffers()
        )

        val result = CatalogPageResult()
        result.availableSortings = availableSortings
        result.paginationMetadata = paginationMetadata
        result.setAvailableFilters(catalogFilterService.buildAvailableFilters(catalogPageRs.getAvailableFilterValues()))
        result.dataOffers = buildCatalogDataOffers(catalogPageRs.getDataOffers())
        return result
    }

    private fun buildCatalogDataOffers(dataOfferRs: List<DataOfferListEntryRs>): List<CatalogDataOffer> {
        return dataOfferRs.stream()
            .map { dataOfferRs: DataOfferListEntryRs -> this.buildCatalogDataOffer(dataOfferRs) }
            .toList()
    }

    private fun buildCatalogDataOffer(dataOfferRs: DataOfferListEntryRs): CatalogDataOffer {
        val asset: UiAsset = dataOfferMappingUtils.buildUiAsset(
            dataOfferRs.assetJsonLd,
            dataOfferRs.connectorEndpoint,
            dataOfferRs.connectorParticipantId,
            dataOfferRs.organizationName
        )

        val dataOffer = CatalogDataOffer()
        dataOffer.assetId = dataOfferRs.assetId
        dataOffer.createdAt = dataOfferRs.createdAt
        dataOffer.updatedAt = dataOfferRs.updatedAt
        dataOffer.asset = asset
        dataOffer.contractOffers = buildCatalogContractOffers(dataOfferRs)
        dataOffer.connectorEndpoint = dataOfferRs.connectorEndpoint
        dataOffer.connectorOfflineSinceOrLastUpdatedAt = dataOfferRs.connectorOfflineSinceOrLastUpdatedAt
        dataOffer.connectorOnlineStatus = getOnlineStatus(dataOfferRs)
        return dataOffer
    }

    private fun buildCatalogContractOffers(dataOfferRs: DataOfferListEntryRs): List<CatalogContractOffer> {
        return dataOfferRs.contractOffers.stream()
            .map(Function<ContractOfferRs, R> { contractOfferDbRow: ContractOfferRs ->
                this.buildCatalogContractOffer(
                    contractOfferDbRow
                )
            })
            .toList()
    }

    private fun buildCatalogContractOffer(contractOfferDbRow: ContractOfferRs): CatalogContractOffer {
        val contractOffer = CatalogContractOffer()
        contractOffer.contractOfferId = contractOfferDbRow.contractOfferId
        contractOffer.contractPolicy = dataOfferMappingUtils.buildUiPolicy(contractOfferDbRow.policyJson)
        contractOffer.createdAt = contractOfferDbRow.createdAt
        contractOffer.updatedAt = contractOfferDbRow.updatedAt
        return contractOffer
    }

    private fun getOnlineStatus(dataOfferRs: DataOfferListEntryRs): ConnectorOnlineStatusDto {
        return when (dataOfferRs.connectorOnlineStatus) {
            ConnectorOnlineStatus.ONLINE -> ConnectorOnlineStatusDto.ONLINE
            ConnectorOnlineStatus.OFFLINE -> ConnectorOnlineStatusDto.OFFLINE
            ConnectorOnlineStatus.DEAD -> ConnectorOnlineStatusDto.DEAD
            else -> throw IllegalStateException("Unknown ConnectorOnlineStatus from DAO for API: " + dataOfferRs.connectorOnlineStatus)
        }
    }

    companion object {
        private fun buildAvailableSortings(): List<CatalogPageSortingItem> {
            return Stream.of(
                CatalogPageSortingType.MOST_RECENT,
                CatalogPageSortingType.TITLE,
                CatalogPageSortingType.ORIGINATOR,
                CatalogPageSortingType.VIEW_COUNT
            ).map { it: CatalogPageSortingType -> CatalogPageSortingItem(it, it.title) }.toList()
        }
    }
}
