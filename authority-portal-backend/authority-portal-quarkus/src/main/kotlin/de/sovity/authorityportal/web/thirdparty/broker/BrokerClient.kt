package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment.BrokerConfig
import io.quarkus.rest.client.reactive.QuarkusRestClientBuilder
import jakarta.ws.rs.core.Response
import java.net.URI

class BrokerClient(private val brokerConfig: BrokerConfig) {

    private val brokerClientResource = QuarkusRestClientBuilder.newBuilder()
        .baseUri(brokerConfig.url().let(URI::create))
        .build(BrokerClientResource::class.java)!!

    fun addConnector(connectorUrl: String) {
        val response = brokerClientResource.addConnectors(
            brokerConfig.apiKey(),
            brokerConfig.adminApiKey(),
            listOf(connectorUrl)
        )

        if (response.status != Response.Status.NO_CONTENT.statusCode) {
            error("Broker API returned unexpected status code: ${response.status}. Expected: ${Response.Status.NO_CONTENT.statusCode}")
        }
    }

    fun removeConnector(connectorUrl: String) {
        TODO("Not yet implemented in Broker API")
    }
}
