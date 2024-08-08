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

/**
 * Implementation of a filter attribute for the catalog.
 *
 * @param name technical id of the attribute
 * @param label UI showing label for the attribute
 * @param idField get available value's id field
 * @param nameField get an available value's name field (optional)
 * @param filterConditionFactory apply the filter
 */
data class FilterAttributeDefinition(
    val name: String,
    val label: String,
    val idField: FilterValueFn,
    val nameField: FilterValueFn?,
    val filterConditionFactory: FilterConditionFactory
)
