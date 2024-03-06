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
package de.sovity.authorityportal.web.thirdparty.caas.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Body for the POST request to CaaS Portal starting the connector")
class CaasPortalDeploymentDto(

    @Schema(description = "The ID of the connector", requiredMode = Schema.RequiredMode.REQUIRED)
    var connectorId: String,
    @Schema(description = "The subdomain of the connector", requiredMode = Schema.RequiredMode.REQUIRED)
    var subdomain: String,
    @Schema(description = "The generated clientID", requiredMode = Schema.RequiredMode.REQUIRED)
    var clientId: String,
    @Schema(description = "Connector title", requiredMode = Schema.RequiredMode.REQUIRED)
    var connectorTitle: String,
    @Schema(description = "Connector description", requiredMode = Schema.RequiredMode.REQUIRED)
    var connectorDescription: String,
    @Schema(description = "The URL of the organization", requiredMode = Schema.RequiredMode.REQUIRED)
    var participantOrganizationUrl: String,
    @Schema(description = "The legal name of the organization", requiredMode = Schema.RequiredMode.REQUIRED)
    var participantOrganizationLegalName: String,
    @Schema(description = "The URL of the DAPS token endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    var dapsTokenUrl: String,
    @Schema(description = "The URL of the DAPS JWKS endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    var dapsJwksUrl: String,
    @Schema(description = "The URL of the Clearing House", requiredMode = Schema.RequiredMode.REQUIRED)
    var clearingHouseUrl: String?,
    @Schema(description = "The URL of the broker", requiredMode = Schema.RequiredMode.REQUIRED)
    var brokerUrl: String?,
    @Schema(description = "Security contact's first name", requiredMode = Schema.RequiredMode.REQUIRED)
    var securityContactFirstName: String,
    @Schema(description = "Security contact's last name", requiredMode = Schema.RequiredMode.REQUIRED)
    var securityContactLastName: String,
    @Schema(description = "Security contact's email", requiredMode = Schema.RequiredMode.REQUIRED)
    var securityContactEmail: String,
    @Schema(description = "Security contact's phone", requiredMode = Schema.RequiredMode.REQUIRED)
    var securityContactPhone: String,
    @Schema(description = "User contact's first name", requiredMode = Schema.RequiredMode.REQUIRED)
    var userContactFirstName: String,
    @Schema(description = "User contact's last name", requiredMode = Schema.RequiredMode.REQUIRED)
    var userContactLastName: String,
    @Schema(description = "User contact's email", requiredMode = Schema.RequiredMode.REQUIRED)
    var userContactEmail: String,
)
