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

@Schema(description = "Data Offer Detail Page Query")
data class DataOfferDetailPageQuery(
    @Schema(description = "Connector ID")
    val connectorId: String,

    @Schema(description = "Asset ID")
    val assetId: String,
)