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

@Schema(
    description = "Filter in form of a conjunctive normal form, meaning (A=X OR A=Y) AND (B=M or B=N). " +
            "Not selected attributes default to TRUE. Used here to let the backend be a SSOT for the available filter options, " +
            "e.g. Transport Mode, Data Model, etc."
)
data class CnfFilter(
    @field:Schema(description = "Available attributes to filter by.", requiredMode = Schema.RequiredMode.REQUIRED)
    val fields: List<CnfFilterAttribute>
)
