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
import de.sovity.authorityportal.broker.dao.utils.JsonDeserializationUtils.read3dStringList
import de.sovity.authorityportal.broker.services.api.filtering.model.FilterAttributeApplied
import de.sovity.authorityportal.broker.services.api.filtering.model.FilterAttributeDefinition
import de.sovity.authorityportal.broker.services.api.filtering.model.FilterCondition
import de.sovity.authorityportal.web.environment.CatalogDataspaceConfigService
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class CatalogFilterService(
    val catalogFilterAttributeDefinitionService: CatalogFilterAttributeDefinitionService,
    val catalogDataspaceConfigService: CatalogDataspaceConfigService
) {

    private val caseInsensitiveEmptyStringLast = Comparator<String> { s1, s2 ->
        when {
            s1.isEmpty() && s2.isNotEmpty() -> 1 // Empty string comes after non-empty
            s1.isNotEmpty() && s2.isEmpty() -> -1 // Non-empty string comes before empty
            else -> String.CASE_INSENSITIVE_ORDER.compare(s1, s2) // Case-insensitive comparison
        }
    }

    private val availableFilters: List<FilterAttributeDefinition>
        /**
         * Currently supported filters for the catalog page.
         *
         * @return attribute definitions
         */
        get() = listOfNotNull(
            catalogFilterAttributeDefinitionService.forIdOnlyField(
                { fields: CatalogQueryFields -> fields.dataSourceAvailabilityLabel },
                "dataSourceAvailability",
                "Data Offer Type"
            ),
            catalogFilterAttributeDefinitionService.buildDataSpaceFilter()
                .takeIf { catalogDataspaceConfigService.hasMultipleDataspaces },
            catalogFilterAttributeDefinitionService.forIdOnlyField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.DATA_CATEGORY },
                "dataCategory",
                "Data Category"
            ),
            catalogFilterAttributeDefinitionService.forIdOnlyField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.DATA_SUBCATEGORY },
                "dataSubcategory",
                "Data Subcategory"
            ),
            catalogFilterAttributeDefinitionService.forIdOnlyField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.DATA_MODEL },
                "dataModel",
                "Data Model"
            ),
            catalogFilterAttributeDefinitionService.forIdOnlyField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.TRANSPORT_MODE },
                "transportMode",
                "Transport Mode"
            ),
            catalogFilterAttributeDefinitionService.forIdOnlyField(
                { fields: CatalogQueryFields -> fields.dataOfferTable.GEO_REFERENCE_METHOD },
                "geoReferenceMethod",
                "Geo Reference Method"
            ),
            catalogFilterAttributeDefinitionService.forIdNameProperty(
                { fields: CatalogQueryFields -> fields.organizationTable.ID },
                { fields: CatalogQueryFields -> fields.organizationTable.NAME },
                "organization",
                "Organization"
            ),
            catalogFilterAttributeDefinitionService.forIdNameProperty(
                { fields: CatalogQueryFields -> fields.connectorTable.CONNECTOR_ID },
                { fields: CatalogQueryFields -> fields.connectorTable.NAME },
                "connectorId",
                "Connector"
            ),
        )

    fun getCatalogQueryFilters(cnfFilterValue: CnfFilterValue?): List<FilterAttributeApplied> {
        val values = getCnfFilterValuesMap(cnfFilterValue)
        return availableFilters
            .map { filter: FilterAttributeDefinition ->
                val queryFilter = getQueryFilter(filter, values[filter.name])
                FilterAttributeApplied(
                    name = filter.name,
                    idField = filter.idField,
                    nameField = filter.nameField,
                    filterConditionOrNull = queryFilter
                )
            }
            .toList()
    }

    private fun getQueryFilter(
        filter: FilterAttributeDefinition,
        values: List<String>?
    ): FilterCondition? {
        if (values.isNullOrEmpty()) {
            return null
        }
        return { fields: CatalogQueryFields -> filter.filterConditionFactory(fields, values) }
    }

    fun buildAvailableFilters(filterValuesJson: String): CnfFilter {
        val filterValues = read3dStringList(filterValuesJson)
        val filterAttributes = zipAvailableFilters(availableFilters, filterValues)
            .map { availableFilter: AvailableFilter ->
                CnfFilterAttribute(
                    id = availableFilter.definition.name,
                    title = availableFilter.definition.label,
                    values = buildAvailableFilterValues(availableFilter),
                    displayType = availableFilter.definition.displayType
                )
            }
        return CnfFilter(filterAttributes)
    }

    private fun buildAvailableFilterValues(availableFilter: AvailableFilter): List<CnfFilterItem> {
        return availableFilter.availableValues
            .map {
                CnfFilterItem(
                    id = it.first(),
                    title = it.last(),
                )
            }
            .sortedWith(java.util.Comparator.comparing({it.title}, caseInsensitiveEmptyStringLast))
    }

    private fun zipAvailableFilters(
        availableFilters: List<FilterAttributeDefinition>,
        filterValues: List<List<List<String>>>
    ): List<AvailableFilter> {
        require(availableFilters.size == filterValues.size) {
            "Number of available filters and filter values must match: ${availableFilters.size} != ${filterValues.size}"
        }
        return availableFilters.mapIndexed { i, it ->
            AvailableFilter(it, filterValues[i])
        }
    }

    private data class AvailableFilter(
        val definition: FilterAttributeDefinition,
        val availableValues: List<List<String>>
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
