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

import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryFields
import org.jooq.Condition

fun interface AttributeFilterQuery {
    /**
     * Filters a Catalog DB Query for a given Filter Attribute with selected values
     *
     * @param fields available tables and fields during the catalog query
     * @param values values to be filtered by. Usually this should mean that only one of the values needs to be present.
     * @return [Condition]
     */
    fun filterDataOffers(fields: CatalogQueryFields, values: Collection<String>): Condition
}
