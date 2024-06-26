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

import de.sovity.authorityportal.api.model.MemberInfo
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Organization information.")
data class OrganizationDetailsDto(
    @field:Schema(description = "MDS-ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val mdsId: String,
    @field:Schema(description = "Legal name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,
    @field:Schema(description = "Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    val businessUnit: String,
    @field:Schema(description = "Industry", requiredMode = Schema.RequiredMode.REQUIRED)
    val industry: String,
    @field:Schema(description = "Main Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainAddress: String,
    @field:Schema(description = "Billing Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val billingAddress: String,
    @field:Schema(description = "Legal ID type", requiredMode = Schema.RequiredMode.REQUIRED)
    val legalIdType: OrganizationLegalIdTypeDto,
    @field:Schema(description = "Legal ID number", requiredMode = Schema.RequiredMode.REQUIRED)
    val legalId: String,
    @field:Schema(description = "Commerce register location (if applicable)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val commerceRegisterLocation: String?,
    @field:Schema(description = "URL of the organization website", requiredMode = Schema.RequiredMode.REQUIRED)
    val url: String,
    @field:Schema(description = "Description of what the company does/is", requiredMode = Schema.RequiredMode.REQUIRED)
    val description: String,
    @field:Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    val registrationStatus: OrganizationRegistrationStatusDto,
    @field:Schema(description = "Member count", requiredMode = Schema.RequiredMode.REQUIRED)
    val memberCount: Int,
    @field:Schema(description = "Connector count", requiredMode = Schema.RequiredMode.REQUIRED)
    var connectorCount: Int,
    @field:Schema(description = "Data offer count", requiredMode = Schema.RequiredMode.REQUIRED)
    var dataOfferCount: Int,
    @field:Schema(description = "Member information", requiredMode = Schema.RequiredMode.REQUIRED)
    val memberList: List<MemberInfo>,
    @field:Schema(description = "Organization creator: User Id", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdByUserId: String,
    @field:Schema(description = "Organization creator: First Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdByFirstName: String,
    @field:Schema(description = "Organization creator: Last Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val createdByLastName: String,
    @field:Schema(description = "Main Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactName: String,
    @field:Schema(description = "Main Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactEmail: String,
    @field:Schema(description = "Main Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactPhone: String,
    @field:Schema(description = "Tech Contact Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactName: String,
    @field:Schema(description = "Tech Contact Email", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactEmail: String,
    @field:Schema(description = "Tech Contact Phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactPhone: String,
    @field:Schema(
        description = "Creation date of organization or organization invite",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val createdAt: OffsetDateTime,
)
