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
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Schema(description = "Information about the organization provided while onboarding.")
data class OnboardingOrganizationUpdateDto(
    @field:NotBlank(message = "Name cannot be blank.")
    @field:Schema(description = "Name", requiredMode = Schema.RequiredMode.REQUIRED)
    val name: String,

    @field:Schema(description = "Organization description", requiredMode = Schema.RequiredMode.REQUIRED)
    val description: String,

    @field:NotBlank(message = "Website cannot be blank.")
    @field:Schema(description = "Website", requiredMode = Schema.RequiredMode.REQUIRED)
    val url: String,

    @field:Schema(description = "Business unit", requiredMode = Schema.RequiredMode.REQUIRED)
    val businessUnit: String,

    @field:Schema(description = "Industry", requiredMode = Schema.RequiredMode.REQUIRED)
    val industry: String,

    @field:NotBlank(message = "Address cannot be blank.")
    @field:Schema(description = "Address", requiredMode = Schema.RequiredMode.REQUIRED)
    val address: String,

    @field:NotBlank(message = "Billing address cannot be blank.")
    @field:Schema(description = "Billing address", requiredMode = Schema.RequiredMode.REQUIRED)
    val billingAddress: String,

    @NotNull(message = "Legal identification type cannot be null")
    @field:Schema(description = "Legal identification type", requiredMode = Schema.RequiredMode.REQUIRED)
    val legalIdType: OrganizationLegalIdTypeDto,

    @field:NotBlank(message = "Legal identification number cannot be blank")
    @field:Schema(description = "Legal identification number", requiredMode = Schema.RequiredMode.REQUIRED)
    val legalIdNumber: String,

    @field:Schema(description = "Commerce register location", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val commerceRegisterLocation: String?,

    @field:NotBlank(message = "Main contact name cannot be blank")
    @field:Schema(description = "Main contact name", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactName: String,

    @field:NotBlank(message = "Main contact email cannot be blank")
    @field:Schema(description = "Main contact email", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactEmail: String,

    @field:NotBlank(message = "Main contact phone cannot be blank")
    @field:Schema(description = "Main contact phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val mainContactPhone: String,

    @field:NotBlank(message = "Technical contact name cannot be blank")
    @field:Schema(description = "Technical contact name", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactName: String,

    @field:NotBlank(message = "Technical contact email cannot be blank")
    @field:Schema(description = "Technical contact email", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactEmail: String,

    @field:NotBlank(message = "Technical contact phone cannot be blank")
    @field:Schema(description = "Technical contact phone", requiredMode = Schema.RequiredMode.REQUIRED)
    val techContactPhone: String,
)
