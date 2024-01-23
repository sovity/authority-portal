package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment.BrokerConfig
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalOrganizationMetadata
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalOrganizationMetadataRequest
import de.sovity.authorityportal.web.utils.urlmanagement.ConnectorUrlUtils
import io.quarkus.rest.client.reactive.QuarkusRestClientBuilder
import jakarta.ws.rs.core.Response
import java.net.URI

class BrokerClient(private val brokerConfig: BrokerConfig, private val connectorUrlUtils: ConnectorUrlUtils) {

    private val brokerClientResource = QuarkusRestClientBuilder.newBuilder()
        .baseUri(brokerConfig.url().let(URI::create))
        .build(BrokerClientResource::class.java)!!

    fun addConnector(connectorBaseUrl: String) {
        addConnectors(listOf(connectorBaseUrl))
    }

    fun addConnectors(connectorBaseUrls: List<String>) {
        val response = brokerClientResource.addConnectors(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            connectorUrlUtils.getConnectorEndpoints(connectorBaseUrls)
        )

        expectStatusCode(response, Response.Status.NO_CONTENT.statusCode, "addConnectors")
    }

    fun removeConnector(connectorBaseUrl: String) {
        val response = brokerClientResource.removeConnectors(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            listOf(connectorUrlUtils.getConnectorEndpoint(connectorBaseUrl))
        )

        expectStatusCode(response, Response.Status.NO_CONTENT.statusCode, "removeConnectors")
    }

    fun getConnectorMetadata(connectorUrls: List<String>): List<AuthorityPortalConnectorInfo> =
        brokerClientResource.getConnectorMetadata(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            connectorUrlUtils.getConnectorEndpoints(connectorUrls)
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
