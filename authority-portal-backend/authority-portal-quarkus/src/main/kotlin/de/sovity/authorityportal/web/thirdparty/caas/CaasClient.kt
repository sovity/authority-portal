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
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasStatusResponse
import io.quarkus.rest.client.reactive.QuarkusRestClientBuilder
import jakarta.annotation.PostConstruct
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.net.URI

@ApplicationScoped
class CaasClient {

    @ConfigProperty(name = "authority-portal.caas.sovity.url")
    lateinit var caasUrl: String

    lateinit var caasClientResource: CaasClientResource

    @PostConstruct
    fun init() {
        caasClientResource = QuarkusRestClientBuilder.newBuilder().baseUri(URI(caasUrl)).build(CaasClientResource::class.java)
    }

    fun requestCaas(apPortalDeploymentDto: CaasPortalDeploymentDto): CaasPortalResponse {
        return caasClientResource.requestCaas(apPortalDeploymentDto)
    }

    fun deleteCaas(connectorIds: List<String>) {
        val response = caasClientResource.deleteCaas(connectorIds)

        expectStatusCode(response, Response.Status.OK.statusCode, "deleteCaas")
    }

    fun validateSubdomain(name: String): Boolean {
        return caasClientResource.validateSubdomain(name).valid
    }

    fun getCaasStatus(connectorIds: List<String>): List<CaasStatusResponse> {
        return caasClientResource.getCaasStatus(connectorIds).value
    }

    private fun expectStatusCode(response: Response, expectedStatusCode: Int, operationName: String) {
        if (response.status != expectedStatusCode) {
            error("CaaS API returned unexpected status code, when trying to call \"$operationName\" endpoint. Actual: ${response.status}, Expected: $expectedStatusCode")
        }
    }
}
