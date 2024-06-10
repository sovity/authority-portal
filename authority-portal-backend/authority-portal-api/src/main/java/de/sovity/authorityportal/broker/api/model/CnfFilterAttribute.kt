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
package de.sovity.authorityportal.broker.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Attribute, e.g. Language")
class CnfFilterAttribute(
    @Schema(description = "Attribute ID", example = "asset:prop:language", requiredMode = Schema.RequiredMode.REQUIRED)
    val id: String,
    @Schema(description = "Attribute Title", example = "Language", requiredMode = Schema.RequiredMode.REQUIRED)
    val title: String,
    @Schema(description = "Available values.", requiredMode = Schema.RequiredMode.REQUIRED)
    val values: List<CnfFilterItem>,
)
