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

package de.sovity.authorityportal.api.model.organization

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Visible organization in organization overview page.")
data class OrganizationOverviewEntryDto(
    @field:Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val id: String,

    @field:Schema(description = "Legal Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,

    @field:Schema(description = "Main Contact Email", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val mainContactEmail: String?,

    @field:Schema(description = "Number of Users", requiredMode = Schema.RequiredMode.REQUIRED)
    val userCount: Int,

    @field:Schema(description = "Number of Connectors", requiredMode = Schema.RequiredMode.REQUIRED)
    val connectorCount: Int,

    @field:Schema(description = "Number of Data Offers", requiredMode = Schema.RequiredMode.REQUIRED)
    val dataOfferCount: Int,

    @field:Schema(description = "Number of Data Offers with a data source", requiredMode = Schema.RequiredMode.REQUIRED)
    val liveDataOfferCount: Int,

    @field:Schema(description = "Number of on-request Data Offers", requiredMode = Schema.RequiredMode.REQUIRED)
    val onRequestDataOfferCount: Int,

    @field:Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    val registrationStatus: OrganizationRegistrationStatusDto,
)
