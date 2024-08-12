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
package de.sovity.authorityportal.broker.services.api.filtering.model

import de.sovity.authorityportal.api.model.catalog.CnfFilterAttributeDisplayType

/**
 * Implementation of a filter attribute for the catalog.
 *
 * @param name technical id of the attribute
 * @param label attribute label is shown as the title of the filter-box in the UI
 * @param displayType how to display the available values in the UI
 * @param idField get available value's id in the JooQ query
 * @param nameField get available value's name in the JooQ query (optional)
 * @param filterConditionFactory apply the filter
 */
data class FilterAttributeDefinition(
    val name: String,
    val label: String,
    val displayType: CnfFilterAttributeDisplayType,
    val idField: FilterValueFn,
    val nameField: FilterValueFn?,
    val filterConditionFactory: FilterConditionFactory
)
