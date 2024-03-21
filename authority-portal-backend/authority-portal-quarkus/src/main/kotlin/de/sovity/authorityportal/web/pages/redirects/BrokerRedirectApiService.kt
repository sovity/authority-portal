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

package de.sovity.authorityportal.web.pages.redirects

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.Response
import java.net.URI
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@ApplicationScoped
class BrokerRedirectApiService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var connectorService: ConnectorService

    fun buildCatalogRedirectWithMdsFilter(mdsId: String, environmentId: String): Response {
        val brokerUrl = deploymentEnvironmentService.findByIdOrThrow(environmentId).broker().url()
        val redirectUrl = "$brokerUrl?mdsId=$mdsId"
        return Response.status(Response.Status.FOUND) // Status code 302
            .location(URI.create(redirectUrl))
            .build()
    }

    fun getCatalogRedirect(environmentId: String): Response {
        val redirectUrl = deploymentEnvironmentService.findByIdOrThrow(environmentId).broker().url()
        return Response.status(Response.Status.FOUND) // Status code 302
            .location(URI.create(redirectUrl))
            .build()
    }
}
