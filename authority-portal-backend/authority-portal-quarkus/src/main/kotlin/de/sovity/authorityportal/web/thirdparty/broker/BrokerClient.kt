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

package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment.BrokerConfig
import de.sovity.authorityportal.web.thirdparty.broker.model.AddedConnector
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalDataOfferInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalOrganizationMetadata
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalOrganizationMetadataRequest
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorCreationRequest
import io.quarkus.rest.client.reactive.QuarkusRestClientBuilder
import jakarta.ws.rs.core.Response
import java.net.URI

class BrokerClient(private val brokerConfig: BrokerConfig) {

    private val brokerClientResource = QuarkusRestClientBuilder.newBuilder()
        .baseUri(brokerConfig.url().let(URI::create))
        .build(BrokerClientResource::class.java)!!

    fun addConnector(connector: AddedConnector) {
        addConnectors(listOf(connector))
    }

    fun addConnectors(connectors: List<AddedConnector>) {
        val response = brokerClientResource.addConnectors(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            ConnectorCreationRequest().also { it.connectors = connectors }
        )

        expectStatusCode(response, Response.Status.NO_CONTENT.statusCode, "addConnectors")
    }

    fun removeConnector(connectorEndpointUrl: String) {
        val response = brokerClientResource.removeConnectors(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            listOf(connectorEndpointUrl)
        )

        expectStatusCode(response, Response.Status.NO_CONTENT.statusCode, "removeConnectors")
    }

    fun getConnectorMetadata(connectorEndpointUrls: List<String>): List<AuthorityPortalConnectorInfo> =
        brokerClientResource.getConnectorMetadata(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            connectorEndpointUrls
        )

    fun setOrganizationMetadata(orgMetadata: List<AuthorityPortalOrganizationMetadata>) {
        val response = brokerClientResource.setOrganizationMetadata(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            AuthorityPortalOrganizationMetadataRequest().apply {
                organizations = orgMetadata
            }
        )

        expectStatusCode(response, Response.Status.NO_CONTENT.statusCode, "setOrganizationMetadata")
    }

    fun getDataOffersInfo(connectorEndpointUrls: List<String>): List<AuthorityPortalDataOfferInfo> =
        brokerClientResource.getDataOfferInfo(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            connectorEndpointUrls
        )

    private fun expectStatusCode(response: Response, expectedStatusCode: Int, operationName: String) {
        if (response.status != expectedStatusCode) {
            error("Broker API returned unexpected status code, when trying to call \"$operationName\" endpoint. Actual: ${response.status}, Expected: $expectedStatusCode")
        }
    }
}
