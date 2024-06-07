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
package de.sovity.authorityportal.api

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.MediaType

@Path("/api/config/")
@Tag(name = "Configuration", description = "Authority Portal configuration API endpoints.")
interface ConfigResource {
    @PUT
    @Path("/log-level")
    @Produces(MediaType.TEXT_PLAIN)
    @Operation(description = "Set the log level of the backend.")
    fun setLogLevel(
        @QueryParam("level")
        @Valid
        @NotBlank(message = "Log level cannot be blank")
        level: String
    ): String
}
