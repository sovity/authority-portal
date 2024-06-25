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
import java.time.OffsetDateTime

@Schema(description = "Data Offer, meaning an offered asset.")
data class CatalogDataOffer(
    @field:Schema(description = "ID of asset", requiredMode = Schema.RequiredMode.REQUIRED)
    val assetId: String,

    @field:Schema(description = "Asset Title", requiredMode = Schema.RequiredMode.REQUIRED)
    val assetTitle: String,

    @field:Schema(description = "Asset Description Short Text generated from description. Contains no markdown.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val descriptionShortText: String?,

    @field:Schema(description = "Asset Keywords", requiredMode = Schema.RequiredMode.REQUIRED)
    val keywords: List<String>,

    @field:Schema(
        description = "Connector ID",
        example = "MDSL1234XX.C1234XX",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val connectorId: String,

    @field:Schema(
        description = "Organization ID",
        example = "MDSL1234XX",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val organizationId: String,

    @field:Schema(
        description = "Organization Name",
        example = "sovity GmbH",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val organizationName: String,

    @field:Schema(description = "Connector Online Status", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorOnlineStatus: ConnectorOnlineStatusDto,

    @field:Schema(description = "Date to be displayed as last update date, for online connectors it's the last refresh date, for offline connectors it's the creation date or last successful fetch.")
    val connectorOfflineSinceOrLastUpdatedAt: OffsetDateTime?,
)

