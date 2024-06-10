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
package de.sovity.authorityportal.broker.dao.pages.catalog

import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter
import de.sovity.authorityportal.broker.utils.CollectionUtils2
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.Field
import org.jooq.JSON
import org.jooq.impl.DSL
import org.jooq.impl.SQLDataType

@ApplicationScoped
class CatalogQueryAvailableFilterFetcher(
    val catalogQueryFilterService: CatalogQueryFilterService
) {
    /**
     * Query available filter values.
     *
     * @param fields      query fields
     * @param searchQuery search query
     * @param filters     filters (values + filter clauses)
     * @return [Field] with field[iFilter][iValue]
     */
    fun queryAvailableFilterValues(
        environment: String,
        fields: CatalogQueryFields,
        searchQuery: String,
        filters: List<CatalogQueryFilter>
    ): Field<JSON> {
        val resultFields: MutableList<Field<JSON>> = ArrayList()
        for (i in filters.indices) {
            // When querying a filter's values we apply all filters except for the current filter's values
            val currentFilter = filters[i]
            val otherFilters = CollectionUtils2.allElementsExceptForIndex(filters, i)
            val resultField = queryFilterValues(environment, fields, currentFilter, searchQuery, otherFilters)
            resultFields.add(resultField)
        }
        return DSL.select(DSL.jsonArray(resultFields)).asField()
    }

    private fun queryFilterValues(
        environment: String,
        parentQueryFields: CatalogQueryFields,
        currentFilter: CatalogQueryFilter,
        searchQuery: String,
        otherFilters: List<CatalogQueryFilter>
    ): Field<JSON> {
        val fields = parentQueryFields.withSuffix("filter_" + currentFilter.name)
        val c = fields.connectorTable
        val d = fields.dataOfferTable

        val value = currentFilter.valueQuery.getAttributeValueField(fields)

        return DSL.select(
            DSL.coalesce(
                DSL.arrayAggDistinct(value),
                DSL.array<Any>().cast<Array<String>>(SQLDataType.VARCHAR.array())
            )
        )
            .from(d)
            .leftJoin(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
            .where(catalogQueryFilterService.filterDbQuery(environment, fields, searchQuery, otherFilters))
            .asField()
    }
}
