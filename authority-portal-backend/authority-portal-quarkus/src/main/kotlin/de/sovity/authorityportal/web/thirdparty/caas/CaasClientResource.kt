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
package de.sovity.authorityportal.web.thirdparty.caas

import de.sovity.authorityportal.web.thirdparty.caas.model.CaasPortalDeploymentDto
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasPortalResponse
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasStatusResponseWrapper
import de.sovity.authorityportal.web.thirdparty.caas.model.SubdomainValidationResponse
import io.quarkus.oidc.client.filter.OidcClientFilter
import jakarta.validation.Valid
import jakarta.validation.constraints.NotNull
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient

@RegisterRestClient
@OidcClientFilter("sovity")
@Path("api/authority-portal")
interface CaasClientResource {

    @POST
    @Path("connectors")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    fun requestCaas(
        @Valid
        @NotNull(message = "AuthorityPortalDeployment cannot be null")
        caasPortalDeploymentDto: CaasPortalDeploymentDto
    ): CaasPortalResponse

    @DELETE
    @Path("connectors")
    @Consumes(MediaType.APPLICATION_JSON)
    fun deleteCaas(
        @Valid
        @NotNull(message = "ConnectorIds cannot be null")
        connectorIds: List<String>
    ): Response

    @PUT
    @Path("connectors/validate-name")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.TEXT_PLAIN)
    fun validateSubdomain(
        @Valid
        @NotNull(message = "Name cannot be null")
        name: String
    ): SubdomainValidationResponse

    @GET
    @Path("connectors/status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    fun getCaasStatus(
        @Valid
        @NotNull(message = "ConnectorIds cannot be null")
        connectorIds: List<String>
    ): CaasStatusResponseWrapper
}
