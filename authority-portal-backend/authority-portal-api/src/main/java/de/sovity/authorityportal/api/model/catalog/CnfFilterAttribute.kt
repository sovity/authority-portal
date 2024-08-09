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
package de.sovity.authorityportal.api.model.catalog

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Attribute, e.g. Language")
data class CnfFilterAttribute(
    @field:Schema(description = "Attribute ID", example = "asset:prop:language", requiredMode = Schema.RequiredMode.REQUIRED)
    val id: String,
    @field:Schema(description = "Attribute Title", example = "Language", requiredMode = Schema.RequiredMode.REQUIRED)
    val title: String,
    @field:Schema(description = "How should items of this filter be rendered in the UI", requiredMode = Schema.RequiredMode.REQUIRED)
    val displayType: CnfFilterAttributeDisplayType,
    @field:Schema(description = "Available values.", requiredMode = Schema.RequiredMode.REQUIRED)
    val values: List<CnfFilterItem>,
)
