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

import de.sovity.authorityportal.broker.services.api.filtering.model.FilterAttributeApplied
import jakarta.enterprise.context.ApplicationScoped
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
        searchQuery: String?,
        filters: List<FilterAttributeApplied>
    ): Field<JSON> {
        val resultFields = filters.mapIndexed { i, currentFilter ->
            // When querying a filter's values we apply all filters except for the current filter
            val otherFilters = filters.filterIndexed { j, _ -> i != j }
            queryFilterValues(environment, fields, currentFilter, searchQuery, otherFilters)
        }
        return DSL.select(DSL.jsonArray(resultFields)).asField()
    }

    private fun queryFilterValues(
        environment: String,
        parentQueryFields: CatalogQueryFields,
        currentFilter: FilterAttributeApplied,
        searchQuery: String?,
        otherFilters: List<FilterAttributeApplied>
    ): Field<JSON> {
        val fields = parentQueryFields.withSuffix("filter_" + currentFilter.name)

        val idField: Field<String> = currentFilter.idField(fields)
        val nameField: Field<String>? = currentFilter.nameField?.invoke(fields)

        val idNameArray = if (nameField == null) {
            DSL.array(idField)
        } else {
            DSL.array(idField, nameField)
        }

        return DSL.select(
            DSL.coalesce(
                DSL.arrayAggDistinct(idNameArray),
                emptyStringArray()
            )
        )
            .fromCatalogQueryTables(fields)
            .where(catalogQueryFilterService.filterDbQuery(environment, fields, searchQuery, otherFilters))
            .asField()
    }

    private fun emptyStringArray() = DSL.value(arrayOf<String>()).cast<Array<String>>(SQLDataType.VARCHAR.array())
}
