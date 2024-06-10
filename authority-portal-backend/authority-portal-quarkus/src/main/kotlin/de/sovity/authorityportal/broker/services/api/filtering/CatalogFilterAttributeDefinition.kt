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

import de.sovity.authorityportal.broker.dao.pages.catalog.models.AvailableFilterValuesQuery

/**
 * Implementation of a filter attribute definition for the catalog.
 *
 * @param name          technical id of the attribute
 * @param label         UI showing label for the attribute
 * @param valueGetter   query existing values from DB
 * @param filterApplier apply a filter to a data offer query
 */
@JvmRecord
data class CatalogFilterAttributeDefinition(
    @JvmField val name: String,
    @JvmField val label: String,
    @JvmField val valueGetter: AvailableFilterValuesQuery,
    @JvmField val filterApplier: AttributeFilterQuery
)
