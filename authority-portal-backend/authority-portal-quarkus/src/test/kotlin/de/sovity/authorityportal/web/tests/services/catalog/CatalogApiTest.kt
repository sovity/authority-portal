/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

package de.sovity.authorityportal.web.tests.services.catalog

import com.fasterxml.jackson.databind.ObjectMapper
import de.sovity.authorityportal.api.CatalogResource
import de.sovity.authorityportal.api.model.catalog.CatalogPageQuery
import de.sovity.authorityportal.api.model.catalog.CatalogPageResult
import de.sovity.authorityportal.api.model.catalog.CatalogPageSortingType
import de.sovity.authorityportal.api.model.catalog.CnfFilterAttribute
import de.sovity.authorityportal.api.model.catalog.CnfFilterItem
import de.sovity.authorityportal.api.model.catalog.CnfFilterValue
import de.sovity.authorityportal.api.model.catalog.CnfFilterValueAttribute
import de.sovity.authorityportal.api.model.catalog.ConnectorOnlineStatusDto
import de.sovity.authorityportal.api.model.catalog.DataOfferDetailPageQuery
import de.sovity.authorityportal.api.model.catalog.DataOfferDetailPageResult
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevAssetId
import de.sovity.authorityportal.seeds.utils.dummyDevConnectorId
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.web.environment.CatalogDataspaceConfig
import de.sovity.authorityportal.web.environment.CatalogDataspaceConfigService
import de.sovity.authorityportal.web.tests.useDevUser
import de.sovity.authorityportal.web.tests.useMockNow
import de.sovity.edc.ext.wrapper.api.common.model.DataSourceAvailability
import de.sovity.edc.ext.wrapper.api.common.model.UiAsset
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.jooq.JSONB
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.whenever
import java.time.OffsetDateTime

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class CatalogApiTest {

    @Inject
    lateinit var catalogResource: CatalogResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Inject
    lateinit var objectMapper: ObjectMapper

    @InjectMock
    lateinit var catalogDataspaceConfigService: CatalogDataspaceConfigService

    @Test
    @TestTransaction
    fun `test two dataspaces and filter for one`() {
        // arrange
        useDevUser(0, 0)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0)
            dataOffer(0, 0, 0)

            connector(1, 0, 0)
            dataOffer(1, 0, 0)

            scenarioInstaller.install(this)
        }

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = mapOf(
                    dummyDevConnectorId(0, 1) to "Dataspace 1",
                    dummyDevConnectorId(0, 2) to "Dataspace 2"
                ),
                defaultName = "MDS"
            )
        )

        val query = CatalogPageQuery(
            filter = CnfFilterValue(
                listOf(
                    CnfFilterValueAttribute("dataSpace", listOf("Dataspace 1"))
                )
            ),
            searchQuery = null,
            sorting = null,
        )

        // act
        val result = catalogResource.catalogPage("test", query)

        // assert
        assertThat(result.dataOffers).hasSize(1)
        assertThat(result.dataOffers.first().connectorId).isEqualTo(dummyDevConnectorId(0, 1))
    }

    @Test
    @TestTransaction
    fun `test connector endpoint filter - two connectors and filter for one`() {
        // arrange
        useDevUser(0, 0)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0) {
                it.endpointUrl = "https://connector-0/dsp"
            }
            dataOffer(0, 0, 0)

            connector(1, 0, 0) {
                it.endpointUrl = "https://connector-1/dsp"
            }
            dataOffer(1, 0, 0)

            scenarioInstaller.install(this)
        }

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = mapOf(
                    dummyDevConnectorId(0, 1) to "Dataspace 1",
                    dummyDevConnectorId(0, 2) to "Dataspace 2"
                ),
                defaultName = "MDS"
            )
        )

        val query = CatalogPageQuery(
            filter = CnfFilterValue(
                listOf(
                    CnfFilterValueAttribute("connectorEndpoint", listOf("https://connector-0/dsp"))
                )
            ),
            searchQuery = null,
            sorting = null
        )

        // act
        val result = catalogResource.catalogPage("test", query)

        // assert
        assertThat(result.dataOffers).hasSize(1)
        assertThat(result.dataOffers.first().connectorId).isEqualTo(dummyDevConnectorId(0, 0))
    }

    @Test
    @TestTransaction
    fun `test available filter values to filter by`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0)
        useMockNow(now)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = mapOf(
                    dummyDevConnectorId(0, 1) to "Dataspace 1",
                    dummyDevConnectorId(0, 2) to "Dataspace 2"
                ),
                defaultName = "MDS"
            )
        )

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0)
            connector(1, 0, 0)
            connector(2, 0, 0)

            dataOffer(0, 0, 1)
            dataOffer(1, 0, 1)
            dataOffer(1, 0, 2)
            dataOffer(2, 0, 3)

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(null, null, null)
        )

        // assert
        val dataspace = getAvailableFilter(result, "dataSpace")
        assertThat(dataspace.values).containsExactly(
            CnfFilterItem("Dataspace 1", "Dataspace 1"),
            CnfFilterItem("Dataspace 2", "Dataspace 2"),
            CnfFilterItem("MDS", "MDS")
        )
    }

    @Test
    @TestTransaction
    fun `test data offer details`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0)
        useMockNow(now)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = mapOf(
                    dummyDevConnectorId(0, 1) to "Dataspace 1",
                    dummyDevConnectorId(0, 2) to "Dataspace 2"
                ),
                defaultName = "MDS"
            )
        )

        val uiAsset = UiAsset().also {
            it.assetId = dummyDevAssetId(0)
            it.title = "Data Offer 0"
            it.description = "Data Offer 0 Description"
            it.dataSourceAvailability = DataSourceAvailability.LIVE
        }

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0) {
                it.onlineStatus = ConnectorOnlineStatus.ONLINE
                it.lastSuccessfulRefreshAt = now.minusHours(1)
                it.endpointUrl = "https://connector-0/dsp"
            }

            dataOffer(0, 0, 0) {
                it.assetTitle = "Data Offer 0"
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset))
                it.descriptionNoMarkdown = "Data Offer Description 0"
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(null, null, null)
        )

        // assert
        assertThat(result.dataOffers).hasSize(1)
        assertThat(result.dataOffers.first().assetId).isEqualTo(dummyDevAssetId(0))
        assertThat(result.dataOffers.first().assetTitle).isEqualTo("Data Offer 0")
        assertThat(result.dataOffers.first().descriptionShortText).isEqualTo("shortDescription")
        assertThat(result.dataOffers.first().connectorOnlineStatus).isEqualTo(ConnectorOnlineStatusDto.ONLINE)
    }

    @Test
    @TestTransaction
    fun `test available filters - no filter`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0)
        useMockNow(now)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = emptyMap(),
                defaultName = "MDS"
            )
        )

        val uiAsset1 = UiAsset().also {
            it.assetId = dummyDevAssetId(0)
            it.title = "Data Offer 0"
            it.description = "Data Offer 0 Description"
            it.transportMode = "Transport Mode 1"
            it.dataSubcategory = "Data Subcategory 1"
            it.dataModel = "Data Model 1"
            it.geoReferenceMethod = "Geo Reference Method 1"
            it.dataSourceAvailability = DataSourceAvailability.LIVE
        }
        val uiAsset2 = UiAsset().also {
            it.assetId = dummyDevAssetId(1)
            it.title = "Data Offer 1"
            it.description = "Data Offer 1 Description"
            it.dataCategory = "Data Category 1"
            it.transportMode = "Transport Mode 1"
            it.dataSubcategory = "Data Subcategory 1"
            it.dataSourceAvailability = DataSourceAvailability.LIVE
        }
        val uiAsset3 = UiAsset().also {
            it.assetId = dummyDevAssetId(2)
            it.title = "Data Offer 2"
            it.description = "Data Offer 2 Description"
            it.dataCategory = "Data Category 1"
            it.transportMode = "Transport Mode 2"
            it.dataSubcategory = "Data Subcategory 2"
            it.dataSourceAvailability = DataSourceAvailability.LIVE
        }
        val uiAsset4 = UiAsset().also {
            it.assetId = dummyDevAssetId(3)
            it.title = "Data Offer 3"
            it.description = "Data Offer 3 Description"
            it.dataCategory = "Data Category 1"
            it.transportMode = ""
            it.dataSourceAvailability = DataSourceAvailability.LIVE
        }

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0) {
                it.onlineStatus = ConnectorOnlineStatus.ONLINE
                it.lastSuccessfulRefreshAt = now.minusHours(1)
                it.endpointUrl = "https://connector-0/dsp"
            }

            dataOffer(0, 0, 0) {
                it.assetTitle = "Data Offer 0"
            }
            dataOffer(0, 0, 1) {
                it.assetTitle = "Data Offer 1"
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset1))
            }
            dataOffer(0, 0, 2) {
                it.assetTitle = "Data Offer 2"
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset2))
            }
            dataOffer(0, 0, 3) {
                it.assetTitle = "Data Offer 3"
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset3))
            }
            dataOffer(0, 0, 4) {
                it.assetTitle = "Data Offer 4"
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset4))
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(null, null, null)
        )

        // assert
        assertThat(result.availableFilters.fields).allSatisfy {
            it.id in setOf(
                "dataSpace",
                "dataCategory",
                "dataSubcategory",
                "dataModel",
                "transportMode",
                "geoReferenceMethod",
                "organizationName",
                "mdsId",
                "connectorId",
                "connectorEndpoint"
            )
        }

        assertThat(result.availableFilters.fields).allSatisfy {
            it.title in setOf(
                "Data Space",
                "Data Category",
                "Data Subcategory",
                "Data Model",
                "Transport Mode",
                "Geo Reference Method",
                "Organization Name",
                "MDS ID",
                "Connector ID",
                "Connector Endpoint"
            )
        }

        val dataSpace = getAvailableFilter(result, "dataSpace")
        assertThat(dataSpace.values).allSatisfy { it.id in setOf("MDS") }

        val dataCategory = getAvailableFilter(result, "dataCategory")
        assertThat(dataCategory.values).allSatisfy { it.id in setOf("Data Category 1") }

        val dataSubcategory = getAvailableFilter(result, "dataSubcategory")
        assertThat(dataSubcategory.values).allSatisfy { it.id in setOf("Data Subcategory 1", "Data Subcategory 2", "") }

        val dataModel = getAvailableFilter(result, "dataModel")
        assertThat(dataModel.values).allSatisfy { it.id in setOf("Data Model 1", "") }

        val transportMode = getAvailableFilter(result, "transportMode")
        assertThat(transportMode.values).allSatisfy { it.id in setOf("Transport Mode 1", "Transport Mode 2", "") }

        val geoReferenceMethod = getAvailableFilter(result, "geoReferenceMethod")
        assertThat(geoReferenceMethod.values).allSatisfy { it.id in setOf("Geo Reference Method 1", "") }

        val curatorOrganizationName = getAvailableFilter(result, "organizationName")
        assertThat(curatorOrganizationName.values).allSatisfy { it.id in setOf("Organization 0") }

        val curatorMdsId = getAvailableFilter(result, "mdsId")
        assertThat(curatorMdsId.values).allSatisfy { it.id in setOf(dummyDevMdsId(0)) }

        val connectorId = getAvailableFilter(result, "connectorId")
        assertThat(connectorId.values).allSatisfy { it.id in setOf(dummyDevConnectorId(0, 0)) }

        val connectorEndpoint = getAvailableFilter(result, "connectorEndpoint")
        assertThat(connectorEndpoint.values).allSatisfy { it.id in setOf("https://connector-0/dsp") }

    }

    /**
     * Regression Test against bug where asset names with capital letters were not hit by search.
     * <br>
     * It was caused by search terms getting lower cased while the LIKE operation being case-sensitive.
     */
    @Test
    @TestTransaction
    fun `test search case insensitive`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0)
        useMockNow(now)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = mapOf(
                    dummyDevConnectorId(0, 1) to "Dataspace 1",
                    dummyDevConnectorId(0, 2) to "Dataspace 2"
                ),
                defaultName = "MDS"
            )
        )

        val uiAsset = UiAsset().also {
            it.assetId = dummyDevAssetId(0)
            it.title = "Hello"
            it.description = "Data Offer 0 Description"
            it.dataSourceAvailability = DataSourceAvailability.LIVE
        }

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0) {
                it.onlineStatus = ConnectorOnlineStatus.ONLINE
                it.lastSuccessfulRefreshAt = now.minusHours(1)
                it.endpointUrl = "https://connector-0/dsp"
            }

            dataOffer(0, 0, 0) {
                it.assetTitle = "Hello"
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset))
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(
                filter = null,
                searchQuery = "Hello",
                sorting = null,
            )
        )

        // assert
        assertThat(result.dataOffers).hasSize(1)
        assertThat(result.dataOffers.first().assetId).isEqualTo(dummyDevAssetId(0))
        assertThat(result.dataOffers.first().assetTitle).isEqualTo("Hello")
    }

    @Test
    @TestTransaction
    fun `test available filters - with filters`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0)
        useMockNow(now)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = emptyMap(),
                defaultName = "MDS"
            )
        )

        val uiAsset1 = UiAsset().also {
            it.assetId = dummyDevAssetId(0)
            it.title = "Data Offer 0"
            it.description = "Data Offer 0 Description"
            it.dataCategory = "Data Category 0"
            it.dataSubcategory = "Data Subcategory 0"
        }
        val uiAsset2 = UiAsset().also {
            it.assetId = dummyDevAssetId(1)
            it.title = "Data Offer 1"
            it.description = "Data Offer 1 Description"
            it.dataSubcategory = "Data Subcategory 1"
        }

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0) {
                it.onlineStatus = ConnectorOnlineStatus.ONLINE
                it.lastSuccessfulRefreshAt = now.minusHours(1)
                it.endpointUrl = "https://connector-0/dsp"
            }

            dataOffer(0, 0, 0) {
                it.assetTitle = "Data Offer 0"
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset1))
            }
            dataOffer(0, 0, 1) {
                it.assetTitle = "Data Offer 1"
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset2))
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(
                filter = CnfFilterValue(
                    listOf(
                        CnfFilterValueAttribute("dataCategory", listOf("")),
                    )
                ),
                searchQuery = null,
                sorting = null
            )
        )

        // assert

        val dataCategory = getAvailableFilter(result, "dataCategory")
        assertThat(dataCategory.values).allSatisfy { it.id in setOf("Data Category 1", "") }
        assertThat(dataCategory.values).allSatisfy { it.title in setOf("Data Category 1", "") }

        val dataSubcategory = getAvailableFilter(result, "dataSubcategory")
        assertThat(dataSubcategory.values).allSatisfy { it.id in setOf("Data Subcategory 1") }
        assertThat(dataSubcategory.values).allSatisfy { it.title in setOf("Data Subcategory 1") }
    }

    @Test
    @TestTransaction
    fun `test pagination - first page`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0)
        useMockNow(now)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = emptyMap(),
                defaultName = "MDS"
            )
        )

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            repeat(15) { index -> dataOffer(0, 0, index) { it.assetId = "my-asset-$index" } }
            repeat(15) { index -> dataOffer(0, 0, index) { it.assetId = "other-asset-$index" } }

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(
                filter = null,
                searchQuery = "my-asset",
                sorting = CatalogPageSortingType.TITLE,
                pageOneBased = 1
            )
        )

        // assert
        assertThat(result.dataOffers).hasSize(10)
        assertThat(result.dataOffers).allSatisfy { it.assetId.contains("my-asset") }

        val actual = result.paginationMetadata
        assertThat(actual.pageOneBased).isEqualTo(1)
        assertThat(actual.pageSize).isEqualTo(10)
        assertThat(actual.numVisible).isEqualTo(10)
        assertThat(actual.numTotal).isEqualTo(15)
    }

    @Test
    @TestTransaction
    fun `test pagination - second page`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0)
        useMockNow(now)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = emptyMap(),
                defaultName = "MDS"
            )
        )

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            repeat(15) { index -> dataOffer(0, 0, index) { it.assetId = "my-asset-$index" } }
            repeat(15) { index -> dataOffer(0, 0, index) { it.assetId = "other-asset-$index" } }

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(
                filter = null,
                searchQuery = "my-asset",
                sorting = CatalogPageSortingType.TITLE,
                pageOneBased = 2
            )
        )

        // assert
        assertThat(result.dataOffers).hasSize(5)
        assertThat(result.dataOffers).allSatisfy { it.assetId.contains("my-asset") }

        val actual = result.paginationMetadata
        assertThat(actual.pageOneBased).isEqualTo(2)
        assertThat(actual.pageSize).isEqualTo(10)
        assertThat(actual.numVisible).isEqualTo(5)
        assertThat(actual.numTotal).isEqualTo(15)
    }

    @Test
    @TestTransaction
    fun `test sorting by popularity`() {
        // arrange
        useDevUser(0, 0)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = emptyMap(),
                defaultName = "MDS"
            )
        )

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            dataOffer(0, 0, 0)
            dataOffer(0, 0, 1)
            dataOffer(0, 0, 2)

            scenarioInstaller.install(this)
        }

        repeat(3) { dataOfferDetails(dummyDevConnectorId(0, 0), dummyDevAssetId(0)) }
        repeat(5) { dataOfferDetails(dummyDevConnectorId(0, 0), dummyDevAssetId(1)) }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(
                filter = null,
                searchQuery = null,
                sorting = CatalogPageSortingType.VIEW_COUNT
            )
        )

        // assert
        assertThat(result.dataOffers).hasSize(3)
        assertThat(result.dataOffers.map { it.assetId }).containsExactly(
            dummyDevAssetId(1),
            dummyDevAssetId(0),
            dummyDevAssetId(2)
        )
    }

    private fun getAvailableFilter(result: CatalogPageResult, filterId: String): CnfFilterAttribute {
        return result.availableFilters.fields.find { it.id == filterId } ?: error("Filter not found")
    }

    private fun dataOfferDetails(connectorId: String, assetId: String): DataOfferDetailPageResult {
        val query = DataOfferDetailPageQuery(
            connectorId = connectorId,
            assetId = assetId,
        )
        return catalogResource.dataOfferDetailPage("test", query)
    }

    @Test
    @TestTransaction
    fun `test filter by org name`() {
        // arrange
        useDevUser(0, 0)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = emptyMap(),
                defaultName = "MDS"
            )
        )

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            dataOffer(0, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(1, 1, 1)
            dataOffer(1, 1, 1)

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(
                filter = CnfFilterValue(
                    listOf(
                        CnfFilterValueAttribute("organizationName", listOf("Organization 0")),
                    )
                ),
                searchQuery = null,
                sorting = null
            )
        )

        // assert
        assertThat(result.dataOffers).hasSize(1)
        assertThat(result.dataOffers.first().connectorId).isEqualTo(dummyDevConnectorId(0, 0))
    }

    @Test
    @TestTransaction
    fun `test search for org name`() {
        // arrange
        useDevUser(0, 0)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = emptyMap(),
                defaultName = "MDS"
            )
        )

        ScenarioData().apply {
            organization(0, 0) {
                it.name = "Test Organization"
            }
            user(0, 0)
            connector(0, 0, 0)
            dataOffer(0, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(1, 1, 1)
            dataOffer(1, 1, 1)

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(
                filter = null,
                searchQuery = "tEsT",
                sorting = null
            )
        )

        // assert
        assertThat(result.dataOffers).hasSize(1)
        assertThat(result.dataOffers.first().connectorId).isEqualTo(dummyDevConnectorId(0, 0))
    }

    @Test
    @TestTransaction
    fun `test filter by mdsId`() {
        // arrange
        useDevUser(0, 0)

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = emptyMap(),
                defaultName = "MDS"
            )
        )

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            dataOffer(0, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(1, 1, 1)
            dataOffer(1, 1, 1)

            scenarioInstaller.install(this)
        }

        // act
        val result = catalogResource.catalogPage(
            environmentId = "test",
            query = CatalogPageQuery(
                filter = CnfFilterValue(
                    listOf(
                        CnfFilterValueAttribute("mdsId", listOf(dummyDevMdsId(0))),
                    )
                ),
                searchQuery = null,
                sorting = null
            )
        )

        // assert
        assertThat(result.dataOffers).hasSize(1)
        assertThat(result.dataOffers.first().connectorId).isEqualTo(dummyDevConnectorId(0, 0))
    }
}
