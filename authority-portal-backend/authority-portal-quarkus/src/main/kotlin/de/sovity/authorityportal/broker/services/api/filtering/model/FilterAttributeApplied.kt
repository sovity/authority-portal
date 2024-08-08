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
 * Abbreviated [FilterAttributeDefinition] with the actual filter condition applied for selected items
 * that came in specifically for this request.
 *
 * Contains the information as required by the JooQ query
 */
data class FilterAttributeApplied(
    val name: String,
    val idField: FilterValueFn,
    val nameField: FilterValueFn?,
    val filterConditionOrNull: FilterCondition?
)
