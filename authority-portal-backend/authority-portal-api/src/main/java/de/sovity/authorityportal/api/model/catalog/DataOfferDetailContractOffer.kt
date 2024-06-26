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

import de.sovity.edc.ext.wrapper.api.common.model.UiPolicy
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "A contract offer a data offer is available under (as required by the data offer detail page).")
data class DataOfferDetailContractOffer(
    @field:Schema(description = "Contract Offer ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val contractOfferId: String,

    @field:Schema(description = "Creation date in Broker", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdAt: OffsetDateTime,

    @field:Schema(description = "Update date in Broker", requiredMode = Schema.RequiredMode.REQUIRED)
    val updatedAt: OffsetDateTime,

    @field:Schema(description = "Contract Policy", requiredMode = Schema.RequiredMode.REQUIRED)
    val contractPolicy: UiPolicy,
)
