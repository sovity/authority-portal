package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment.BrokerConfig
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalOrganizationMetadata
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalOrganizationMetadataRequest
import io.quarkus.rest.client.reactive.QuarkusRestClientBuilder
import jakarta.ws.rs.core.Response
import java.net.URI

class BrokerClient(private val brokerConfig: BrokerConfig) {

    private val brokerClientResource = QuarkusRestClientBuilder.newBuilder()
        .baseUri(brokerConfig.url().let(URI::create))
        .build(BrokerClientResource::class.java)!!

    fun addConnector(connectorEndpointUrl: String) {
        addConnectors(listOf(connectorEndpointUrl))
    }

    fun addConnectors(connectorEndpointUrls: List<String>) {
        val response = brokerClientResource.addConnectors(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            connectorEndpointUrls
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


    private fun expectStatusCode(response: Response, expectedStatusCode: Int, operationName: String) {
        if (response.status != expectedStatusCode) {
            error("Broker API returned unexpected status code, when trying to call \"$operationName\" endpoint. Actual: ${response.status}, Expected: $expectedStatusCode")
        }
    }
}
