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

package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "All data for connector overview page(s).")
data class ProvidedConnectorOverviewResult(
    @field:Schema(description = "Visible connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectors: List<ProvidedConnectorOverviewEntryDto>,
)
