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

import de.sovity.edc.ext.wrapper.api.common.model.UiAsset
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Data Offer Detail Page.")
data class DataOfferDetailPageResult(
    @field:Schema(description = "ID of asset", requiredMode = Schema.RequiredMode.REQUIRED)
    val assetId: String,

    @field:Schema(description = "Title of asset", requiredMode = Schema.RequiredMode.REQUIRED)
    val assetTitle: String,

    @field:Schema(
        description = "Connector ID",
        example = "MDSL1234XX.C1234XX",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val connectorId: String,

    @field:Schema(
        description = "Connector Endpoint",
        example = "https://my-test.connector/api/dsp",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val connectorEndpoint: String,

    @field:Schema(
        description = "Organization Name",
        example = "sovity GmbH",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val organizationName: String,

    @field:Schema(
        description = "Organization ID",
        example = "MDSL1234XX",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val organizationId: String,

    @field:Schema(description = "Connector Online Status", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorOnlineStatus: ConnectorOnlineStatusDto,

    @field:Schema(
        description = "Date to be displayed as last update date, for online connectors it's the " +
            "last refresh date, for offline connectors it's the creation date or last successful fetch.",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val connectorOfflineSinceOrLastUpdatedAt: OffsetDateTime,

    @field:Schema(description = "Creation date in Broker", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdAt: OffsetDateTime,

    @field:Schema(description = "Update date in Broker", requiredMode = Schema.RequiredMode.REQUIRED)
    val updatedAt: OffsetDateTime,

    @field:Schema(description = "Asset properties", requiredMode = Schema.RequiredMode.REQUIRED)
    val asset: UiAsset,

    @field:Schema(description = "Available Contract Offers", requiredMode = Schema.RequiredMode.REQUIRED)
    val contractOffers: List<DataOfferDetailContractOffer>,

    @field:Schema(description = "View Count", requiredMode = Schema.RequiredMode.REQUIRED)
    val viewCount: Int,
)
