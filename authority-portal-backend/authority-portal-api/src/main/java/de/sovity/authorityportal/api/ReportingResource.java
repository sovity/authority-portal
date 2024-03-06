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

package de.sovity.authorityportal.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;

@Path("/api/reporting/")
@Tag(name = "Reporting", description = "Authority Portal Reporting API Endpoints.")
public interface ReportingResource {

    @GET
    @Path("/connectors")
    @Produces("text/csv")
    @Operation(description = "Download own organization connectors information as csv")
    Response createConnectorsCsvReport(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/users")
    @Produces("text/csv")
    @Operation(description = "Download organization's users reporting details.")
    Response createUsersAndRolesCsvReport();

    @GET
    @Path("/data-offers")
    @Produces("text/csv")
    @Operation(description = "Download data offers reporting details.")
    Response createDataOffersCsvReport(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/system-stability")
    @Produces("text/csv")
    @Operation(description = "Download system stability reporting details.")
    Response createSystemStabilityCsvReport(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );
}
