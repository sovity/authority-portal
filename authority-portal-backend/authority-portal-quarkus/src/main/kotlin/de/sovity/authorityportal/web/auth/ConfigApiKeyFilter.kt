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

package de.sovity.authorityportal.web.auth

import de.sovity.authorityportal.web.utils.unauthorized
import jakarta.ws.rs.container.ContainerRequestContext
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jboss.resteasy.reactive.server.ServerRequestFilter

class ConfigApiKeyFilter {

    @ConfigProperty(name = "authority-portal.config.api-key")
    lateinit var apiKey: String

    @ServerRequestFilter(preMatching = true)
    fun filterApiKey(containerRequestContext: ContainerRequestContext) {
        val requestUri = containerRequestContext.uriInfo.requestUri.path

        if (requestUri.startsWith("/api/config")) {
            val apiKeyHeader = containerRequestContext.getHeaderString("x-api-key")

            if (apiKey != apiKeyHeader) {
                unauthorized("Invalid API key")
            }
        }
    }
}
