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
import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryService
import de.sovity.authorityportal.broker.dao.pages.catalog.models.DataOfferListEntryRs
import de.sovity.authorityportal.broker.dao.pages.dataoffer.model.ContractOfferRs
import de.sovity.authorityportal.broker.services.api.filtering.CatalogFilterService
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.util.Objects
import java.util.stream.Stream

@ApplicationScoped
class CatalogApiService {
    @Inject
    lateinit var paginationMetadataUtils: PaginationMetadataUtils

    @Inject
    lateinit var catalogQueryService: CatalogQueryService

    @Inject
    lateinit var dataOfferMappingUtils: DataOfferMappingUtils

    @Inject
    lateinit var catalogFilterService: CatalogFilterService

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    fun catalogPage(environment: String, query: CatalogPageQuery): CatalogPageResult {
        val brokerConfig = deploymentEnvironmentService.findByIdOrThrow(environment).broker()
        val filters = catalogFilterService.getCatalogQueryFilters(query.filter)

        val pageQuery = paginationMetadataUtils.getPageQuery(
            query.pageOneBased,
            brokerConfig.catalogPagePageSize()
        )

        val availableSortings = buildAvailableSortings()
        var sorting = query.sorting
        if (sorting == null) {
            sorting = availableSortings[0].sorting
        }

        // execute db query
        val catalogPageRs = catalogQueryService.queryCatalogPage(
            dsl,
            environment,
            query.searchQuery,
            filters,
            sorting,
            pageQuery
        )

        val paginationMetadata = paginationMetadataUtils.buildPaginationMetadata(
            query.pageOneBased,
            brokerConfig.catalogPagePageSize(),
            catalogPageRs.dataOffers.size,
            catalogPageRs.numTotalDataOffers
        )

        return CatalogPageResult(
            availableSortings = availableSortings,
            paginationMetadata = paginationMetadata,
            availableFilters = catalogFilterService.buildAvailableFilters(catalogPageRs.availableFilterValues),
            dataOffers = buildCatalogDataOffers(catalogPageRs.dataOffers)
        )
    }

    private fun buildCatalogDataOffers(dataOfferRs: List<DataOfferListEntryRs>): List<CatalogDataOffer> {
        return dataOfferRs.map {
            buildCatalogDataOffer(it)
        }
    }

    private fun buildCatalogDataOffer(dataOfferRs: DataOfferListEntryRs): CatalogDataOffer {
        val asset = dataOfferMappingUtils.buildUiAsset(
            dataOfferRs.assetJsonLd,
            dataOfferRs.connectorEndpointUrl,
            dataOfferRs.connectorParticipantId,
            dataOfferRs.organizationName
        )

        return CatalogDataOffer(
            assetId = dataOfferRs.assetId,
            createdAt = dataOfferRs.createdAt,
            updatedAt = dataOfferRs.updatedAt,
            asset = asset,
            contractOffers = buildCatalogContractOffers(dataOfferRs),
            connectorEndpoint = dataOfferRs.connectorEndpointUrl,
            connectorOfflineSinceOrLastUpdatedAt = dataOfferRs.connectorOfflineSinceOrLastUpdatedAt,
            connectorOnlineStatus = getOnlineStatus(dataOfferRs)
        )
    }

    private fun buildCatalogContractOffers(dataOfferRs: DataOfferListEntryRs): List<CatalogContractOffer> {
        return dataOfferRs.contractOffers.stream()
            .map { contractOfferDbRow: ContractOfferRs -> this.buildCatalogContractOffer(contractOfferDbRow) }
            .toList()
    }

    private fun buildCatalogContractOffer(contractOfferDbRow: ContractOfferRs): CatalogContractOffer {
        return CatalogContractOffer(
            contractOfferId = contractOfferDbRow.contractOfferId,
            contractPolicy = dataOfferMappingUtils.buildUiPolicy(contractOfferDbRow.policyJson),
            createdAt = contractOfferDbRow.createdAt,
            updatedAt = contractOfferDbRow.updatedAt
        )
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
            ).map { it: CatalogPageSortingType -> CatalogPageSortingItem(it, it.title) }
                .toList()
        }
    }
}

