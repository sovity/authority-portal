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
package de.sovity.authorityportal.broker.services.api.filtering

import de.sovity.authorityportal.api.model.catalog.CnfFilter
import de.sovity.authorityportal.api.model.catalog.CnfFilterAttribute
import de.sovity.authorityportal.api.model.catalog.CnfFilterItem
import de.sovity.authorityportal.api.model.catalog.CnfFilterValue
import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryFields
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter
import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQuerySelectedFilterQuery
import de.sovity.authorityportal.broker.dao.utils.JsonDeserializationUtils.read2dStringList
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class CatalogFilterService(
    val catalogFilterAttributeDefinitionService: CatalogFilterAttributeDefinitionService
) {

    private val caseInsensitiveEmptyStringLast = Comparator<String> { s1, s2 ->
        when {
            s1.isEmpty() && s2.isNotEmpty() -> 1 // Empty string comes after non-empty
            s1.isNotEmpty() && s2.isEmpty() -> -1 // Non-empty string comes before empty
            else -> String.CASE_INSENSITIVE_ORDER.compare(s1, s2) // Case-insensitive comparison
        }
    }

    private val availableFilters: List<CatalogFilterAttributeDefinition>
        /**
         * Currently supported filters for the catalog page.
         *
         * @return attribute definitions
         */
        get() = listOf(
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.getAssetStringProperty("dataSourceAvailability") },
                "dataSourceAvailability",
                "Data Source Availability"
            ),
            catalogFilterAttributeDefinitionService.buildDataSpaceFilter(),
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.DATA_CATEGORY },
                "dataCategory",
                "Data Category"
            ),
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.DATA_SUBCATEGORY },
                "dataSubcategory",
                "Data Subcategory"
            ),
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.DATA_MODEL },
                "dataModel",
                "Data Model"
            ),
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.TRANSPORT_MODE },
                "transportMode",
                "Transport Mode"
            ),
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.GEO_REFERENCE_METHOD },
                "geoReferenceMethod",
                "Geo Reference Method"
            ),
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.organizationTable.NAME },
                "organizationName",
                "Organization Name"
            ),
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.connectorTable.MDS_ID },
                "mdsId",
                "MDS ID"
            ),
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.connectorTable.CONNECTOR_ID },
                "connectorId",
                "Connector ID"
            ),
            catalogFilterAttributeDefinitionService.forField(
                { fields: CatalogQueryFields -> fields.connectorTable.ENDPOINT_URL },
                "connectorEndpoint",
                "Connector Endpoint"
            )
        )

    fun getCatalogQueryFilters(cnfFilterValue: CnfFilterValue?): List<CatalogQueryFilter> {
        val values = getCnfFilterValuesMap(cnfFilterValue)
        return availableFilters
            .map { filter: CatalogFilterAttributeDefinition ->
                val queryFilter = getQueryFilter(filter, values[filter.name])
                CatalogQueryFilter(
                    filter.name,
                    filter.valueGetter,
                    queryFilter
                )
            }
            .toList()
    }

    private fun getQueryFilter(
        filter: CatalogFilterAttributeDefinition,
        values: List<String>?
    ): CatalogQuerySelectedFilterQuery? {
        if (values.isNullOrEmpty()) {
            return null
        }
        return { fields: CatalogQueryFields -> filter.filterApplier(fields, values) }
    }

    fun buildAvailableFilters(filterValuesJson: String): CnfFilter {
        val filterValues = read2dStringList(filterValuesJson)
        val filterAttributes = zipAvailableFilters(availableFilters, filterValues)
            .map { availableFilter: AvailableFilter ->
                CnfFilterAttribute(
                    availableFilter.definition.name,
                    availableFilter.definition.label,
                    buildAvailableFilterValues(availableFilter)
                )
            }
            .toList()
        return CnfFilter(filterAttributes)
    }

    private fun buildAvailableFilterValues(availableFilter: AvailableFilter): List<CnfFilterItem> {
        return availableFilter.availableValues
            .sortedWith(caseInsensitiveEmptyStringLast)
            .map { CnfFilterItem(it, it) }
            .toList()
    }

    private fun zipAvailableFilters(
        availableFilters: List<CatalogFilterAttributeDefinition>,
        filterValues: List<List<String>>
    ): List<AvailableFilter> {
        require(availableFilters.size == filterValues.size) {
            "Number of available filters and filter values must match: ${availableFilters.size} != ${filterValues.size}"
        }
        return availableFilters.mapIndexed { i, it ->
            AvailableFilter(it, filterValues[i])
        }
    }

    private data class AvailableFilter(
        val definition: CatalogFilterAttributeDefinition,
        val availableValues: List<String>
    )

    private fun getCnfFilterValuesMap(cnfFilterValue: CnfFilterValue?): Map<String, List<String>> {
        if (cnfFilterValue?.selectedAttributeValues == null) {
            return emptyMap()
        }
        return cnfFilterValue.selectedAttributeValues
            .filter { it.selectedIds.isNotEmpty() }
            .associate { it.id to it.selectedIds }
    }
}
